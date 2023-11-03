$(document).ready(function () {
    const api ='/api.aspx'
    $('#xem-don').click(function () {
        //alert('hehehe')
        $.confirm({
            title: "Danh sách đơn hàng",
            content: `<div id="ds_don_hang">Loading......</div>`,
            ColumnClass: 'large',
            onContentReady: function () {
                $.post(api, { action: 'list_don_hang' },
                function (data) {
                    alert(data)
                    var noidung = "solo yasuo "
                    $('#ds_don_hang').html(noidung);
                })
            }
        });
    });
})