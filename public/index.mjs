let worker;

const algorithms = {
    'ripemd160': {
        enabled: true,
        callback: undefined,
    },
    'md5': {
        enabled: true,
        callback: undefined,
    },
    'sha1': {
        enabled: true,
        callback: undefined,
    },
    'sha256': {
        enabled: true,
        callback: undefined,
    },
    'sha512': {
        enabled: true,
        callback: undefined,
    },
    'blake3': {
        enabled: true,
        callback: undefined,
    },
    'crc32': {
        enabled: true,
        callback: undefined,
    },
}

const createCallback = (sent) => {
    return (received) => {
        const {
            id: sentId,
            algorithm,
            lang,
        } = sent;

        const {
            id: recvId,
            digest,
            elapsed,
        } = received;

        if (sentId !== recvId) {
            return;
        }

        const el = document.getElementById(`${algorithm}-digest`);
        el.ariaBusy = false;
        el.innerText = `${elapsed}ms ${lang} ${digest}`;
    };
};

const initWorker = () => {
    if (worker !== undefined) {
        worker.terminate();
    }

    worker = new Worker(new URL('./worker.mjs', import.meta.url));

    worker.onmessage = ({ data }) => {
        if (!data) {
            console.error(`Received invalid worker response.`);
            return;
        }

        for (const [_, { enabled, callback }] of Object.entries(algorithms)) {
            if (enabled && callback !== undefined) {
                callback(data);
            }
        }
    };
};

let id = 0;

const updateHashDigests = () => {
    const inputEl = document.getElementById('input');
    const iterationsEl = document.getElementById('iterations');
    const langEl = document.getElementById('languages');

    if (iterationsEl.value === '') {
        return;
    }

    const iterations = parseInt(iterationsEl.value);

    if (iterations <= 0) {
        return;
    }

    const lang = langEl.options[langEl.selectedIndex].value;

    if (!lang) {
        return;
    }

    initWorker();

    for (let [algorithm, { enabled }] of Object.entries(algorithms)) {
        const el = document.getElementById(`${algorithm}-digest`);

        if (!enabled) {
            el.classList.add('disable');
            el.innerText = '(disabled)';
            continue;
        }

        el.classList.remove('disable');
        el.innerText = '';
        el.ariaBusy = true;

        const message = {
            id: id++,
            algorithm: algorithm,
            lang: lang,
            input: inputEl.value,
            iterations,
        };

        console.log(JSON.stringify(message));

        algorithms[algorithm].callback = createCallback(message);
        worker.postMessage(message);
    };
};

document.addEventListener('DOMContentLoaded', () => {
    const inputEl = document.getElementById('input');
    const langEl = document.getElementById('languages');
    const iterationsEl = document.getElementById('iterations');

    iterationsEl.addEventListener('input', () => {
        const invalidNumberEl = document.getElementById('invalid-number');
        const num = Number(iterationsEl.value);

        if (iterationsEl.value !== '' && num >= 1 && Number.isInteger(num)) {
            invalidNumberEl.classList.add('valid');
        } else {
            invalidNumberEl.classList.remove('valid');
        }

        updateHashDigests();
    });

    inputEl.addEventListener('input', () => {
        updateHashDigests();
    });

    langEl.addEventListener('change', () => {
        updateHashDigests();
    });

    updateHashDigests();
});