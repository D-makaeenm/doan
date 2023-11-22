$(document).ready(function () {
    const api = '/api.aspx'
    //------------------------------------------------------------------

    let dalogin = false;
    let quyen = 0;

    function load_gui(dalogin) {
        if (dalogin == true) {
            $('#xem-don').show();
            $('#tong-thu-chi').show();
            $('#them-don').show();
            $('#don-da-xoa').show();
            $('#cong-thuc').show();
            $('#div-kh').hide();
        }
    }

    function dologin() {
        $.confirm({
            title: "Đăng nhập",
            content: ``
                + `<form action="" class="form_name">` +
                `<div class="form-group">` +
                `<label>Tài khoản</label>` +
                `<input type="text" placeholder="Tài khoản" class="tk form-control" required />` +
                `<label>Mật khẩu</label>` +
                `<input type="password" placeholder="Mật khẩu" class="mk form-control" required />` +
                `</div` +
                `</form>`
            ,
            buttons: {
                formSumbit: {
                    text: 'Đăng nhập',
                    btnClass: 'btn-blue',
                    action: function () {
                        var tkb = this.$content.find('.tk').val();
                        var mkb = this.$content.find('.mk').val();
                        if (!tkb || !mkb) {
                            $.alert('Bạn chưa điền gì cả !');
                            return false;
                        }
                        else {
                            $.post(api, { action: 'logins' },
                                function (data) {
                                    //alert(data)//{"ok":1,"msg":"ok","data":[{"tk":admin,"mk":"123"}]}
                                    var json = JSON.parse(data);//chuyen text trong data -> doi tuonng 
                                    var loginok = false;
                                    if (json.ok) {
                                        for (var tt of json.data) {
                                            if (tt.tk == tkb && tt.mk == mkb && tt.roles == 1) {
                                                quyen = 1;
                                                dalogin = true;
                                                break;
                                            }
                                            else if (tt.tk == tkb && tt.mk == mkb && tt.roles == 2) {
                                                dalogin = true;
                                                quyen = 2;
                                                break;
                                            }
                                        }
                                        if (quyen == 1) {
                                            $.alert("Đăng nhập thành công!");
                                            $('#btn-login').hide();
                                            $('#hello').show();
                                            $('#btn-logout').show();
                                            load_gui(dalogin);
                                        }
                                        else if (dalogin) {
                                            $.alert("Đăng nhập thành công!");
                                            $('#btn-login').hide();
                                            $('#hello1').show();
                                            $('#btn-logout').show();
                                            load_gui(dalogin);
                                        }
                                        else {
                                            $.alert("Sai tài khoản hoặc mật khẩu!");
                                            return false;
                                        }
                                    }
                                })
                        }
                    }
                },
                somethingElse: {
                    text: 'Thoát',
                    btnClass: 'btn-red'
                }
            },
            onContentReady: function () {

            }
        })
    }

    $('#btn-logout').click(function () {
        logout();
    });

    function logout() {
        window.location.href = window.location.origin + window.location.pathname;
    }

    $('#logo-click').click(function () {
        window.location.href = window.location.origin + window.location.pathname;
    });

    function checkAccess(quyen) {
        if (!dalogin) {
            return 0;
        }
        else if (quyen == 1) {
            return 1;
        }
        else if (quyen == 2) {
            return 2;
        }
    }

    $('#tong-thu-chi').click(function () {
        if (checkAccess(quyen) == 1) {
            doanhthu();
        }
        else if (checkAccess(quyen) == 0) {
            alert("Bạn cần đăng nhập để sử dụng chức năng này");
        }
        else if (checkAccess(quyen) == 2) {
            alert("Bạn không đủ quyền để thực hiện ")
        }
    });

    $('#btn-login').click(function () {
        dologin();
    });

    function list_don() {
        $.confirm({
            title: "Danh sách đơn hàng",
            content: `<div id="ds_don_hang">Loading......</div>`,
            columnClass: 'col-md-12',
            type: 'green',
            typeAnimated: true,
            buttons: {
                add: {
                    text: "Thêm đơn",
                    btnClass: 'btn-green any-other-class',
                    action: function () {
                        them_don();
                        return false;
                    }
                },
                xemdonxoa: {
                    text: "Xem đơn đã xóa",
                    btnClass: 'btn-green any-other-class',
                    action: function () {
                        dondaxoa();
                        return false;
                    }
                },
                Close: {
                    btnClass: 'btn-red any-other-class'
                }
            },

            onContentReady: function () {
                capnhatdonhang();
            }
        });
    }

    function capnhatdonhang() {
        $.post(api, { action: 'list_don_hang' },
            function (data) {
                var json = JSON.parse(data);
                var noidung = "";
                if (json.ok) {
                    noidung += `<table class="table table-hover">`;
                    noidung += `<thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đơn</th>
                        <th>Mã khách hàng</th>
                        <th>Tên khách hàng</th>
                        <th>Tên bánh</th>
                        <th>Size</th>
                        <th>Số lượng</th>
                        <th>Giá tiền</th>
                        <th>Tổng tiền</th>
                        <th>Ngày đặt</th>
                    </tr>
                    </thead><tbody>`;
                    var stt = 0;
                    for (var dh of json.data) {//moi 1 don hang trong json thi lam gi (lay thuoc tinh moi don hang )
                        var tongtien = dh.giatien * dh.sl;
                        var sua_xoa = `<button class="btn btn-sm btn-warning nut-sua-xoa" data-idd="${dh.madon}" data-action="edit_don_hang">Sửa</button>`;
                        sua_xoa += ` <button class="btn btn-sm btn-danger nut-sua-xoa" data-idd="${dh.madon}" data-action="xoa_don_hang">Xóa</button>`;
                        noidung += `
                        <tr>
                            <td>${++stt}</td>
                            <td>${dh.madon}</td>
                            <td>${dh.makh}</td>
                            <td>${dh.tenkh}</td>
                            <td>${dh.tenbanh}</td>
                            <td>${dh.size}</td>
                            <td>${dh.sl}</td>
                            <td>${dh.giatien}</td>
                            <td>${tongtien}</td>
                            <td>${dh.ngaydat}</td>
                            <td>${sua_xoa}</td>
                        </tr>`;
                    }
                    noidung += "</tbody></table>"
                }
                else {
                    noidung = " khong co du lieu";
                }
                $('#ds_don_hang').html(noidung);
                $('.nut-sua-xoa').click(function () {
                    if (checkAccess(quyen)==1 || checkAccess(quyen)==2) {
                        var action = $(this).data('action')  //lấy action kèm theo
                        var madon = $(this).data('idd')  //lấy cid kèm theo
                        if (action == 'xoa_don_hang') { //dùng action
                            //can xac nhan
                            xoa_don(madon, json); //dùng id vào đây để hàm này xử, cho khỏi rối code
                        } else if (action == 'edit_don_hang') {
                            //ko can xac nhan
                            sua_don(madon, json);
                        }
                    }
                });
            }
        )
    }


    function sua_don(madon, json) {
        var don;
        for (var obj of json.data) {
            if (obj.madon == madon) {
                don = obj;
                break;
            }
        }
        var dialog_edit = $.confirm({
            title: `sửa đơn hàng`,
            type: 'orange',
            typeAnimated: true,
            content: `` +
                '<label>Mã khách hàng</label>' + '<input class="name form-control" id="edit-makh">'+
                '<label>Tên khách hàng:</label>' + '<input class="name form-control" id="edit-tenkh">' +
                '<label>Địa chỉ:</label>' + '<input class="name form-control" id="edit-diachi">' +
                '<label>SDT</label>' + '<input class="name form-control" id="edit-sdt">' +
                '<label style = "margin-top:10px"> Ngày đặt:</label>' + '<input style = "margin-top:10px" id = "edit-ngaydat" type="date" name="datePicker"><br>' +
                '<label style = "margin-top:10px">Mã bánh:</label>' +
                '<select name="mabanh" style = "margin-top:10px" id= "edit-mabanh"><option value="pz-01">pz-01</option><option value="pz-02">pz-02</option><option value="pz-03">pz-03</option><option value="pz-04">pz-04</option><option value="pz-05">pz-05</option><option value="pz-06">pz-06</option></select><br>' +
                `<label style = "margin-top:10px">Size:</label>` +
                `<select style = "margin-left:35px" name="size" id="edit-size">
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                </select><br>`+
                `<label style = "margin-top:10px">Số lượng:</label>` + '<input style = "margin-top:10px" id="edit-sl"><br>'
            ,

            buttons: {
                save: {
                    btnClass: 'btn-green any-other-class',
                    action: function () {
                        var makh = $('#edit-makh').val();
                        var data_gui_di = {
                            action: 'edit_don_hang',
                            tenkh: $('#edit-tenkh').val(),
                            diachi: $('#edit-diachi').val(),
                            sdt: $('#edit-sdt').val(),
                            ngaydat: $('#edit-ngaydat').val(),
                            mabanh: $('#edit-mabanh').val(),
                            size: $('#edit-size').val(),
                            sl: $('#edit-sl').val(),
                            makh: makh,
                            madon: madon
                        }
                         console.log(data_gui_di)
                        $.post(api, data_gui_di, function (data) {
                            var json = JSON.parse(data);

                            if (json.ok) {
                                dialog_edit.close();
                                capnhatdonhang();
                            }
                            else {
                                alert(json.msg);
                            }
                        })
                    }
                },
                cancel: {
                    btnClass: 'btn-red any-other-class'
                }
            }
        });
    }

    function xoa_don(madon, json) {
        var don;
        for (var obj of json.data) {
            if (obj.madon == madon) {
                don = obj;
                break;
            }
        }
        var dialog_xoa = $.confirm({
            title: `Xác nhận xóa đơn ${don.madon}`,
            content: `Are you sure ?`,
            buttons: {
                YES: {
                    btnClass: 'btn-green any-other-class',
                    action: function () {
                        var data_gui_di = {
                            action: 'xoa_don_hang',
                            madon: madon,
                        }
                        $.post(api, data_gui_di, function (data) {
                            var json = JSON.parse(data);
                            if (json.ok) {
                                dialog_xoa.close();
                                capnhatdonhang();
                            } else {
                                alert(json.msg)
                            }
                        })
                    }
                },
                NO: {
                    btnClass: 'btn-red any-other-class',
                }
            }
        });

    }

    //--------------------------------------------------------------

    function test() {
        $.post(api, { action: 'don_da_xoa' },
            function (data) {
                var json = JSON.parse(data);
                var noidung = "";
                if (json.ok) {
                    noidung += `<table class="table table-hover">`;
                    noidung += `<thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đơn</th>
                        <th>Mã khách hàng</th>
                        <th>Ngày xóa</th>
                    </tr>
                    </thead><tbody>`;
                    var stt = 0;
                    for (var dh of json.data) {//moi 1 don hang trong json thi lam gi (lay thuoc tinh moi don hang )
                        noidung += `
                        <tr>
                            <td>${++stt}</td>
                            <td>${dh.madon}</td>
                            <td>${dh.makh}</td>
                            <td>${dh.delat}</td>
                        </tr>`;
                    }
                    noidung += "</tbody></table>"
                }
                else {
                    noidung = " khong co du lieu";
                }
                $('#ds_xoa').html(noidung);
            }
        )
    }

    function dondaxoa() {
        $.confirm({
            title: "Danh sách đơn hàng đã xóa",
            content: `<div id="ds_xoa">Loading......</div>`,
            columnClass: 'col-md-12',
            type: 'green',
            typeAnimated: true,
            onContentReady: function () {
                test();
            }
        });
    }




    //---------------------------------------------------------------
    $('#kh-them-don').click(function () {
        kh_dat_don();
    });
    function kh_dat_don() {
        var dialog_add = $.confirm({
            title: `Đặt hàng`,
            type: 'green',
            typeAnimated: true,
            content: '' + '<label>Hãy chọn vị trí của bạn</label><br>' +
                '<button class="btn btn-primary my-2 rounded-pill" id="xem-map">Xem map</button>' +
                '<div id="map"></div> ',
            buttons: {
                ok: {
                    text: 'Đặt hàng',
                    btnClass: 'btn-green any-other-class'
                },
                close: {
                    btnClass: 'btn-red any-other-class'
                }
            },
            onOpenBefore: function () {
                // Gán sự kiện click cho nút "Xem map"
                $('#xem-map').on('click', function () {
                    $('#map').html(`
                    <div class="google-map">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d1560.2498949215549!2d105.84614115410433!3d21.549961620519024!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1700651842354!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                    `);
                });
            }
        });
    }


    //--------------------------------------------------------------

    function them_don() {
        var dialog_add = $.confirm({
            title: `Thêm mới đơn hàng`,
            type: 'green',
            typeAnimated: true,
            content: '' +
                '<label>Mã khách hàng:</label>' + '<input type="text" placeholder="không được trùng mã kh đã có" class="name form-control" id="nhap-makh" >' +
                '<label>Tên khách hàng:</label>' + '<input class="name form-control" id="ten-kh">' +
                '<label>Địa chỉ:</label>' + '<input class="name form-control" id="dia-chi">' +
                '<label>SDT</label>' + '<input class="name form-control" id="sdt">' +
                '<label style = "margin-top:10px"> Ngày đặt:</label>' + '<input style = "margin-top:10px" id = "ngay-dat" type="date" name="datePicker"><br>' +
                '<label style = "margin-top:10px">Mã bánh:</label>' +
                '<select name="mabanh" style = "margin-top:10px" id= "ma-banh"><option value="pz-01">pz-01</option><option value="pz-02">pz-02</option><option value="pz-03">pz-03</option><option value="pz-04">pz-04</option><option value="pz-05">pz-05</option><option value="pz-06">pz-06</option></select><br>' +
                `<label style = "margin-top:10px">Size:</label>` +
                `<select style = "margin-left:35px" name="size" id="size">
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                </select><br>`+
                `<label style = "margin-top:10px">Số lượng:</label>` + '<input style = "margin-top:10px" id="sl"><br>',
            buttons: {
                save: {
                    text: `Thêm đơn hàng vào database`,
                    btnClass: 'btn-green any-other-class',
                    action: function () {
                        var makh = $('#nhap-makh').val();
                        var tenkh = $('#ten-kh').val();
                        var ngaydat = $('#ngay-dat').val();
                        var mabanh = $('#ma-banh').val();
                        var size = $('#size').val();
                        var sl = $('#sl').val();
                        var diachi = $('#dia-chi').val();
                        var sdt = $('#sdt').val();
                        if (makh === "" || ngaydat === "" || size === "" || tenkh === "" || mabanh === "" || sl === "" || diachi === "" || sdt === "") {
                            alert("Hãy nhập đủ dữ liệu");
                            return false;
                        }
                        else {
                            var data_gui_di = {
                                action: 'them_don_hang',
                                makh: makh,
                                ngaydat: ngaydat,
                                mabanh: mabanh,
                                size: size,
                                tenkh: tenkh,
                                sl: sl,
                                diachi: diachi,
                                sdt: sdt
                            }
                            $.post(api, data_gui_di, function (data) {
                                console.log(data_gui_di);
                                var json = JSON.parse(data);
                                alert("da gui thanh cong");
                                if (json.ok) {
                                    dialog_add.close();
                                    capnhatdonhang();
                                }
                                else {
                                    alert(json.msg);
                                }
                            });
                        }
                    }
                },
                close: {
                    btnClass: 'btn-red any-other-class'
                }
            }
        });
    }


    function congthuc() {
        var selectedId;
        var dialog_ct = $.confirm({
            title: `Công thức làm bánh `,
            content: '' + '<label>Bạn muốn xem công thức nào?</label><br>' +
                `<select name="congthuc" id="ct">
                <option value="pz-03">Pizza bò bằm</option>
                <option value="pz-05">Pizza Hawaii</option>
                <option value="pz-04">Pizza hải sản</option>
                <option value="pz-01">Pizza Margherita</option>
                <option value="pz-06">Pizza phô mai</option>
                <option value="pz-02">Pizza thập cẩm</option>
            </select><br>`+
                '<button class="btn-success any-other-class">Xem</button>',
            buttons: {
                close: {
                    btnClass: 'btn-red any-other-class'
                }
            },
            onContentReady: function () {
                $('#ct').on('change', function () {
                    selectedId = $(this).val();
                });

                $('.btn-success').on('click', function () {
                    if (selectedId) {
                        $.post(api, { action: 'cong_thuc', mabanh: selectedId }, function (data) {
                            var json = JSON.parse(data);
                            if (json.ok) {
                                var noidung = "";
                                for (var ct of json.data) {
                                    $.confirm({
                                        title: `Công thức của ${ct.tenbanh}`,
                                        content: noidung += `<p>${ct.congthuc}</p>`,
                                        buttons: {
                                            close: {
                                                btnClass: 'btn-red any-other-class'
                                            }
                                        }
                                    });
                                }


                            } else {
                                alert("Không có dữ liệu");
                            }
                        });
                    }
                });
            }
        });
    }

    function doanhthu() {
        $.confirm({
            title: `Xem doanh thu`,
            content: '' +
                '<label>Bạn muốn xem khoảng thời gian nào ?</label><br>' +
                '<label>Từ khoảng:</label>' + '<input style = "margin-top:10p   x; margin-left:10px" id = "ngay-vao" type="date" name="datePicker"><br>' +
                '<label>Đến:</label>' + '<input style = "margin-top:10px; margin-left:56px" id = "ngay-ra" type="date" name="datePicker"><br>' +
                '<div id="dt-thang">Loading......</div>',
            columnClass: 'col-md-12',
            type: 'green',
            typeAnimated: true,
            buttons: {
                xem: {
                    text: 'Xem',
                    btnClass: 'btn-green any-other-class',
                    action: function () {
                        var ngayvao = $('#ngay-vao').val();
                        var ngayra = $('#ngay-ra').val();
                        if (ngayra === "" || ngayvao === "") {
                            alert("Hãy điền đủ thông tin");
                        }
                        else {
                            var data_gui_di = {
                                action: 'doanh_thu',
                                ngayvao: ngayvao,
                                ngayra: ngayra
                            }

                            $.post(api, data_gui_di, function (data) {
                                console.log(data_gui_di);
                                var json = JSON.parse(data);
                                var noidung = "";
                                if (json.ok) {
                                    noidung += `<table class="table table-hover">`;
                                    noidung += `<thead>
                                <tr>
                                    <th>Tiền thu</th>
                                    <th>Tiền chi</th>
                                    <th>Tổng doanh thu</th>
                                </tr>
                                </thead><tbody>`;
                                    var tongdt = 0;
                                    var tienthu = 0;
                                    var tienchi = 0;
                                    for (var dh of json.data) {
                                        tienthu += parseInt(dh.tongtien);
                                        tienchi += parseInt(dh.thiethai);
                                        tongdt = tienthu - tienchi;
                                    }
                                    noidung += `
                                        <tr>
                                        <td>${tienthu}</td>
                                        <td>${tienchi}</td>
                                        <td>${tongdt}</td>
                                        </tr>`;
                                    noidung += `</tbody></table>`;
                                }
                                else {
                                    noidung = "Không có dữ liệu doanh thu cho khoảng thời gian này.";
                                }
                                $('#dt-thang').html(noidung);
                            });
                        }


                        return false;
                    }
                },
                Close: {
                    btnClass: 'btn-red any-other-class'
                }
            },
            onContentReady: function () {

            }
        });
    }


    $('#them-don').click(function () {
        if (checkAccess(quyen) == 1) {
            them_don();
        }
        else if (checkAccess(quyen) == 0) {
            alert("Bạn cần đăng nhập để sử dụng chức năng này");
        }
        else if (checkAccess(quyen) == 2) {
            them_don();
        }

    });

    $('#xem-don').click(function () {
        if (checkAccess(quyen) == 1) {
            list_don();
        }
        else if (checkAccess(quyen) == 0) {
            alert("Bạn cần đăng nhập để sử dụng chức năng này");
        }
        else if (checkAccess(quyen) == 2) {
            list_don();
        }

    });

    $('#don-da-xoa').click(function () {

        if (checkAccess(quyen) == 1) {
            dondaxoa();
        }
        else if (checkAccess(quyen) == 0) {
            alert("Bạn cần đăng nhập để sử dụng chức năng này");
        }
        else if (checkAccess(quyen) == 2) {
            dondaxoa();
        }
    });
    $('#cong-thuc').click(function () {
        if (checkAccess(quyen) == 1) {
            congthuc();
        }
        else if (checkAccess(quyen) == 0) {
            alert("Bạn cần đăng nhập để sử dụng chức năng này");
        }
        else if (checkAccess(quyen) == 2) {
            congthuc();
        }

    });
})

//-------------------------------------------------------------