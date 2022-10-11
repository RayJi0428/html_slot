(function () {
    const items = [
        '🍭',
        '❌',
        '⛄️',
        '🦄',
        '🍌',
        '💩',
        '👻',
        '😻',
        '💵',
        '🤡',
        '🦖',
        '🍎',
        '😂',
        '🖕',
    ];
    const doors = document.querySelectorAll('.door');

    //監聽SPIN(後續改SR觸發)
    document.querySelector('#spinner').addEventListener('click', spin);

    //生成item數量
    const NUM_ITEM = 15;
    //彩券位數
    const LOTTERY_DIGIT = 7;
    //啟動到停止秒數
    const SPIN_DURATION = 1;
    //目前第一顆內容
    var head = 'ready!';

    /**
     * 啟動
     * @param {*} firstInit 
     * @param {*} groups 
     * @param {*} duration 
     * @returns 
     */
    function init(firstInit = true, groups = 1, duration = 1) {
        for (const door of doors) {

            if (firstInit) {
                door.dataset.spinned = '0';
            } else if (door.dataset.spinned === '1') {
                return;
            }

            const boxes = door.querySelector('.boxes');
            const boxesClone = boxes.cloneNode(false);
            //頭要先塞上次最後結果
            let pool = [head];

            if (!firstInit) {
                const arr = [];
                for (let i = 0; i < NUM_ITEM; ++i) {
                    arr.push(randomNum(LOTTERY_DIGIT));
                }
                pool = pool.concat(arr);

                boxesClone.addEventListener(
                    'transitionstart',
                    function () {
                        door.dataset.spinned = '1';
                        this.querySelectorAll('.box').forEach((box) => {
                            box.style.filter = 'blur(2px)';
                        });
                    },
                    { once: true }
                );

                boxesClone.addEventListener(
                    'transitionend',
                    function () {
                        //動畫結束後要更新head下次使用
                        head = arr[arr.length - 1];
                        this.querySelectorAll('.box').forEach((box, index) => {
                            box.style.filter = 'blur(0)';
                            if (index > 0) this.removeChild(box);
                        });
                    },
                    { once: true }
                );
            }

            for (let i = pool.length - 1; i >= 0; i--) {
                const box = document.createElement('div');
                box.classList.add('box');
                box.style.width = door.clientWidth + 'px';
                box.style.height = door.clientHeight + 'px';
                box.textContent = pool[i];
                boxesClone.appendChild(box);
            }
            boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
            boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
            door.replaceChild(boxesClone, boxes);
        }
    }

    /**
     * 開始轉動
     */
    async function spin() {
        //spin前先重置
        init();
        //開始轉動
        init(false, 1, SPIN_DURATION);

        //只塞第一個
        let door = doors[0]
        const boxes = door.querySelector('.boxes');
        const duration = parseFloat(boxes.style.transitionDuration);
        // window.alert(duration)
        setTimeout(() => {
            boxes.style.transform = 'translateY(0)';
        }, 1);
        await new Promise((resolve) => setTimeout(resolve, duration * 100));
    }

    /**
     * 對目標陣列隨機排序(目前用不到先留著)
     * @param {*} param0 
     * @returns 
     */
    function shuffle([...arr]) {
        let m = arr.length;
        while (m) {
            const i = Math.floor(Math.random() * m--);
            [arr[m], arr[i]] = [arr[i], arr[m]];
        }
        return arr;
    }

    function randomNum(n) {
        let res = '';
        for (let i = 0; i < n; ++i) {
            res += Math.floor(Math.random() * 10);
        }
        return res;
    }

    init();
})();
