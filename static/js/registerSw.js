function urlB64ToUnit8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    return outputArray.map((output, index) => rawData.charCodeAt(index));
}


async function registerSw() {
    if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.register('sw.js');
        initialiseState(reg)

    } else {
        alert("Не поддерживается воркер")
    }
}


async function initialiseState(reg) {
    if (!reg.showNotification) {
        alert("Уведомления не поддерживаются")
        return
    }
    if (Notification.permission === 'denied') {
        alert('Вы заперетили отправлять вам уведомления')
        return
    }
    if (!'PushManager' in window) {
        alert("В вашем браузере отсутствует поддержка push")
        return
    }
    subscribe(reg);
}

async function subscribe(reg) {
    const subscription = await reg.pushManager.getSubscription();
    if (subscription) {
        sendSubData(subscription);
        return;
    }

    const vapidMeta = document.querySelector('meta[name="vapid-key"]');
    const key = vapidMeta.content;
    const options = {
        userVisibleOnly: true,
        // if key exists, create applicationServerKey property
        ...(key && {applicationServerKey: urlB64ToUnit8Array(key)})
    };

    const sub = await reg.pushManager.subscribe(options);
    sendSubData(sub)
}

async function sendSubData(subscription) {
    const browser = navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/ig)[0].toLowerCase();
    const data = {
        status_type: 'subscribe',
        subscription: subscription.toJSON(),
        browser: browser,
        group: "all"
    };

    const res = await fetch('/webpush/save_information', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        },
        credentials: "include"
    });

    handleResponse(res);
}

async function handleResponse(res) {
    console.log(res.status);
}

registerSw();
