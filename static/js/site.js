const submitBtn = document.getElementById("submitBtn")
const titleInput = document.getElementById("title")
const bodyArea = document.getElementById("body")


submitBtn.addEventListener('click', async function (_) {
    const head = titleInput.value;
    const body = bodyArea.value;

    submitBtn.innerText = 'Отправка...';
    submitBtn.disabled = true;

    const res = await fetch('/send_push', {
        method: 'POST',
        body: JSON.stringify({head, body}),
        headers: {
            'content-type': 'application/json'
        }
    });
    if (res.status === 200) {
        submitBtn.innerText = 'Подождите';
        submitBtn.disabled = true
        setTimeout(function () {
            submitBtn.innerText = 'Отправить';
            submitBtn.disabled = false
        }, 2000)
        titleInput.value = '';
        bodyArea.value = '';
    } else {
        submitBtn.innerText = 'Что-то сломалось. Попробуйте еще раз';
        submitBtn.disabled = false;
    }
});