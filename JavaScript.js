$(document).ready(function () {
    $("#nutne").on("click", function () {
        $.confirm({
            title: 'Nhập tên',
            content: '' +
                '<form>' +
                '<div class="onhapten">' +
                '<label for="name">Tên:</label>' +
                '<input type="text" id="name" class="name form-control" required />' +
                '</div>' +
                '</form>',
            buttons: {
                confirm: {
                    text: 'Xác nhận',
                    btnClass: 'btn-blue',
                    action: function () {
                        var name = this.$content.find('.name').val();
                        if (!name) {
                            $.alert('Bạn chưa nhập tên.');
                            return false;
                        }
                        $.alert('Tên của bạn là: ' + name);
                    }
                },
                cancel: {
                    text: 'Hủy',
                    btnClass: 'btn-red',
                    action: function () {
                        // Hành động khi người dùng nhấn Hủy
                    }
                }
            }
        });
    });

    fetch('http://127.0.0.1:1880/xem-diem')
        .then(response => response.json())
        .then(data => {
            console.log(data.key1);
            console.log(data.key2);
        })
        .catch(error => {
            console.error('Loi' + error);
        });










});

