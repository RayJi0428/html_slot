(function () {
    const items = [
        'ð­',
        'â',
        'âï¸',
        'ð¦',
        'ð',
        'ð©',
        'ð»',
        'ð»',
        'ðµ',
        'ð¤¡',
        'ð¦',
        'ð',
        'ð',
        'ð',
    ];
    const doors = document.querySelectorAll('.door');

    //ç£è½SPIN(å¾çºæ¹SRè§¸ç¼)
    document.querySelector('#spinner').addEventListener('click', spin);

    //çæitemæ¸é
    const NUM_ITEM = 15;
    //å½©å¸ä½æ¸
    const LOTTERY_DIGIT = 7;
    //ååå°åæ­¢ç§æ¸
    const SPIN_DURATION = 1;
    //ç®åç¬¬ä¸é¡å§å®¹
    var head = 'ready!';

    /**
     * åå
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
            //é ­è¦åå¡ä¸æ¬¡æå¾çµæ
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
                        //åç«çµæå¾è¦æ´æ°headä¸æ¬¡ä½¿ç¨
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
     * éå§è½å
     */
    async function spin() {
        //spinååéç½®
        init();
        //éå§è½å
        init(false, 1, SPIN_DURATION);

        //åªå¡ç¬¬ä¸å
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
     * å°ç®æ¨é£åé¨æ©æåº(ç®åç¨ä¸å°åçè)
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
