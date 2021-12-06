self.addEventListener('push', function (event) {
    const eventInfo = event.data.text();
    const data = JSON.parse(eventInfo);
    const head = data.head || 'Уведомление';
    const body = data.body || 'Текст уведомления';

    event.waitUntil(
        self.registration.showNotification(head, {
            body: body,
            icon: 'simensgreen.online/static/img/logo.jpg'
        })
    );
});