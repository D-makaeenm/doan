$(document).ready(function () {
    const api = '/api.aspx'
    //------------------------------------------------------------------

    let dalogin = false;
    let quyen = 0;

    function load_gui(dalogin, quyen) {
        if (dalogin == true && quyen == 1 || dalogin == true && quyen == 2) { //quyen quan ly + nhan vien
            $('#xem-don').show();
            $('#tong-thu-chi').show();
            $('#them-don').show();
            $('#don-da-xoa').show();
            $('#don-da-done').show();
            $('#div-kh').hide();
            $('#xem-don-nhap').show();
            $('#messageql').show();
            $('#kho').show();
        }
        else if (dalogin == true && quyen == 3) {//quen nha cung cap
            $('#xem-don').hide();
            $('#tong-thu-chi').hide();
            $('#them-don').hide();
            $('#don-da-xoa').hide();
            $('#div-kh').hide();
            $('#xem-don-nhap').show();
            $('#messageql').hide();
            $('#messagekh').hide();
            $('#kho').hide();
        }
        else if(dalogin = false){ //quyen khach hang
            $('#messagekh').show();
            $('#messageql').hide();

        }
    } //giao dien khi dang nhap voi cac quyen

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
                                            else if (tt.tk == tkb && tt.mk == mkb && tt.roles == 3) {
                                                dalogin = true;
                                                quyen = 3;
                                                break;
                                            }
                                        }
                                        if (quyen == 1) {
                                            $.alert("Đăng nhập thành công!");
                                            $('#btn-login').hide();
                                            $('#hello').show();
                                            $('#btn-logout').show();
                                            load_gui(dalogin,quyen);
                                        }
                                        else if (quyen == 2) {
                                            $.alert("Đăng nhập thành công!");
                                            $('#btn-login').hide();
                                            $('#hello1').show();
                                            $('#btn-logout').show();
                                            load_gui(dalogin, quyen);
                                        }
                                        else if (quyen == 3) {
                                            $.alert("Đăng nhập thành công!");
                                            $('#btn-login').hide();
                                            $('#hello2').show();
                                            $('#btn-logout').show();
                                            load_gui(dalogin, quyen);
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
    }  //login

    $('#btn-logout').click(function () {
        logout();
    }); //logout

    function logout() {
        window.location.href = window.location.origin + window.location.pathname;
    } //reload page while logout

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
        else if (quyen == 3) {
            return 3;
        }
    } //check roles

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
        else if (checkAccess(quyen) == 3) {
            alert("Bạn không đủ quyền để thực hiện ")
        }
    }); //roles

    $('#btn-login').click(function () {
        dologin();
    }); //login

    function dondaxoa() {
        $.confirm({
            title: "Danh sách đơn hàng đã xóa",
            content: `<div id="ds_xoa">Loading......</div>`,
            columnClass: 'col-md-12',
            type: 'green',
            typeAnimated: true,
            onContentReady: function () {
                donxoa();
            }
        });
    }

    function donxoa() {
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
                        <th>Tên khách hàng</th>
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
                            <td>${dh.tenkh}</td>
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

    $('#kho').click(function () {
        list_kho();
    });

    function list_kho() {
        $.confirm({
            title: "Danh sách hàng",
            content: '' +
                '<div id="ds_kho">Loading......</div>',
            columnClass: 'col-md-12',
            type: 'green',
            typeAnimated: true,
            buttons: {
                Close: {
                    btnClass: 'btn-red any-other-class'
                }
            },

            onContentReady: function () {
                capnhatkho();
            }
        });
    }

    function capnhatkho() {
        $.post(api, { action: 'show_kho' },
            function (data) {
                var json = JSON.parse(data);
                var noidung = "";
                if (json.ok) {
                    noidung += `<table class="table table-hover">`;
                    noidung += `<thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên bánh</th>
                        <th>Size</th>
                        <th>Số lượng</th>
                    </tr>
                    </thead><tbody>`;
                    var stt = 0;
                    for (var dh of json.data) {//moi 1 don hang trong json thi lam gi (lay thuoc tinh moi don hang )
                        noidung += `
                        <tr>
                            <td>${++stt}</td>
                            <td>${dh.tenbanh}</td>
                            <td>${dh.size}</td>
                            <td>${dh.sl}</td>
                        </tr>`;
                    }
                    noidung += "</tbody></table>"
                }
                else {
                    noidung = "khong co du lieu";
                }
                $('#ds_kho').html(noidung);
            }
        )
    }

    function list_don() {
        $.confirm({
            title: "Danh sách đơn hàng",
            content: '' + 
            //'<label>Tìm kiếm</label>' + '<input type="text" placehoder = "Tên khách hàng" id="nhap-ten">' +
            //'<button style="margin-left:10px" id="loc-ten">Lọc</button>' +
            '<div id="ds_don_hang">Loading......</div>',
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
                xemdondone: {
                    text: "Xem đơn đã done",
                    btnClass: 'btn-green any-other-class',
                    action: function () {
                        dondadone();
                        return false;
                    }
                }
                ,
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
                        var sua_xoa = `<button class="btn btn-sm btn-warning nut-sua-xoa" data-idd="${dh.madon}" data-action="edit_don_hang">Sửa</button>`;
                        sua_xoa += ` <button class="btn btn-sm btn-danger nut-sua-xoa" data-idd="${dh.madon}" data-action="xoa_don_hang">Xóa</button>`;
                        sua_xoa += ` <button class="btn btn-sm btn-success nut-sua-xoa" data-idd="${dh.madon}" data-action="done_don_hang">Hoàn thành</button>`;
                        noidung += `
                        <tr>
                            <td>${++stt}</td>
                            <td>${dh.madon}</td>
                            <td>${dh.makh}</td>
                            <td>${dh.tenkh}</td>
                            <td>${dh.tenbanh}</td>
                            <td>${dh.size}</td>
                            <td>${dh.sl}</td>
                            <td>${dh.giaban}</td>
                            <td>${dh.tongtien}</td>
                            <td>${dh.ngaydat}</td>
                            <td>${sua_xoa}</td>
                        </tr>`;
                    }
                    noidung += "</tbody></table>"
                }
                else {
                    noidung = "khong co du lieu";
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
                        else if (action == 'done_don_hang') {
                            done_don(madon, json);
                        }
                    }
                });
            }
        )
    }

    function done_don(madon, json) {
        var don;
        for (var obj of json.data) {
            if (obj.madon == madon) {
                don = obj;
                break;
            }
        }
        var dialog_done = $.confirm({
            title: `Xác nhận hoàn thành đơn ${don.madon}`,
            content: `Are you sure ?`,
            buttons: {
                YES: {
                    btnClass: 'btn-green any-other-class',
                    action: function () {
                        var data_gui_di = {
                            action: 'done_don_hang',
                            madon: madon,
                        }
                        $.post(api, data_gui_di, function (data) {
                            var json = JSON.parse(data);
                            if (json.ok) {
                                dialog_done.close();
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

    function dondadone() {
        $.confirm({
            title: "Danh sách đơn hàng đã hoàn thành",
            content: `<div id="ds_xoa">Loading......</div>`,
            columnClass: 'col-md-12',
            type: 'green',
            typeAnimated: true,
            onContentReady: function () {
                dondone();
            }
        });
    }

    function dondone() {
        $.post(api, { action: 'don_da_done' },
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
                        <th>Tổng tiền</th>
                        <th>Ngày hoàn thành</th>
                    </tr>
                    </thead><tbody>`;
                    var stt = 0;
                    for (var dh of json.data) {//moi 1 don hang trong json thi lam gi (lay thuoc tinh moi don hang )
                        noidung += `
                        <tr>
                            <td>${++stt}</td>
                            <td>${dh.madon}</td>
                            <td>${dh.makh}</td>
                            <td>${dh.tenkh}</td>
                            <td>${dh.tongtien}</td>
                            <td>${dh.doneat}</td>
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
                '<label>Tên khách hàng:</label>' + '<input class="name form-control" id="edit-tenkh">' +
                '<label>Địa chỉ:</label>' + '<input class="name form-control" id="edit-dia-chi">' +
                '<label>SDT</label>' + '<input class="name form-control" id="edit-sdt">' +
                `<select name="tenbanh" style = "margin-top:10px" id= "edit-ten-banh">
                <option value="Pizza Margherita">Pizza Margherita</option>
                <option value="Pizza thập cẩm">Pizza thập cẩm</option>
                <option value="Pizza bò">Pizza bò bằm</option>
                <option value="Pizza biển khơi">Pizza hải sản</option>
                <option value="Pizza Hawaii">Pizza Hawaii</option>
                <option value="Pizza phô mai">Pizza phô mai</option>
                </select><br>` +
                '<label style = "margin-top:10px"> Ngày đặt:</label>' + '<input style = "margin-top:10px" id = "edit-ngaydat" type="date" name="datePicker"><br>' +
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
                        var data_gui_di = {
                            action: 'edit_don_hang',
                            tenkh: $('#edit-tenkh').val(),
                            diachi: $('#edit-dia-chi').val(),
                            sdt: $('#edit-sdt').val(),
                            tenbanh: $('#edit-ten-banh').val(),
                            ngaydat: $('#edit-ngaydat').val(),
                            size: $('#edit-size').val(),
                            sl: $('#edit-sl').val(),
                            madon: madon
                        }
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

    //---------------------------------------------------------------
    $('#kh-them-don').click(function () {
        them_don();
    });



    //--------------------------------------------------------------
    function checkdau(inputchuoi) {
        var diacriticRegex = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/;
        return diacriticRegex.test(inputchuoi);
    }

    function them_don() {
	    var dialog_add = $.confirm({
		    title: `Thêm mới đơn hàng`,
		    type: 'green',
		    typeAnimated: true,
		    content: '' +
			    '<label>Tên khách hàng:</label>' + '<input class="name form-control" placeholder="Vui lòng viết có dấu" id="ten-kh">' +
			    '<label>Địa chỉ:</label>' + '<input class="name form-control" id="dia-chi">' +
			    '<label>SDT</label>' + '<input class="name form-control" id="sdt">' +
                '<label style = "margin-top:10px"> Ngày đặt:</label>' + '<input style = "margin-top:10px" id = "ngay-dat" type="datetime-local" name="datePicker"><br>' +
                '<label style = "margin-top:10px">Tên bánh:</label>' +
                `<select name="tenbanh" style = "margin-top:10px" id= "ten-banh">
                <option value="Pizza Margherita">Pizza Margherita</option>
                <option value="Pizza thập cẩm">Pizza thập cẩm</option>
                <option value="Pizza bò">Pizza bò bằm</option>
                <option value="Pizza biển khơi">Pizza hải sản</option>
                <option value="Pizza Hawaii">Pizza Hawaii</option>
                <option value="Pizza phô mai">Pizza phô mai</option>
                </select><br>` +
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
                        var tenkh = $('#ten-kh').val();
                        var diachi = $('#dia-chi').val();
                        var sdt = $('#sdt').val();
					    var ngaydat = $('#ngay-dat').val();
                        var tenbanh = $('#ten-banh').val();
					    var size = $('#size').val();
					    var sl = $('#sl').val();
                        if (checkdau(tenkh)== false) {
                            alert("xin điền đủ họ tên")
                        }
                        if (tenkh === "" || ngaydat === "" || size === "" || tenbanh === "" || sl === "" || diachi === "" || sdt === "") {
						    alert("Hãy nhập đủ dữ liệu");
						    return false;
					    }
					    else {
						    var data_gui_di = {
							    action: 'them_don_hang',
                                tenkh: tenkh,
							    ngaydat: ngaydat,
                                tenbanh: tenbanh,
							    size: size,
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
                        var tienthune = 0;
                        var doanhthune = 0;
                        var tienchine = 0;
                        if (ngayra === "" || ngayvao === "") {
                            alert("Hãy điền đủ thông tin");
                        }
                        else {
                            var data_gui_di = {
                                action: 'tinh_tien_thu',
                                ngayvao: ngayvao,
                                ngayra: ngayra
                            }
                            var data_gui_di2 = {
                                action: 'tinh_tien_chi',
                                ngayvao: ngayvao,
                                ngayra: ngayra
                            }
                            $.post(api, data_gui_di2, function (data) { //post 1
                                console.log(data_gui_di2);
                                var json = JSON.parse(data);
                                if (json.ok) {
                                    for (var dh of json.data) {
                                        tienchine = dh.tienchi;
                                        //tienchine sang dc post 2 -> xuyen suot post
                                    }
                                }
                                $.post(api, data_gui_di, function (data) { //post 2
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
                                        for (var dh of json.data) {
                                            tienthune = dh.tienthu;
                                            doanhthune = tienthune - tienchine;
                                            noidung += `
                                            <tr>
                                            <td>${tienthune}</td>
                                            <td>${tienchine}</td>
                                            <td>${doanhthune}</td>
                                            </tr>`;
                                        }
                                        noidung += `</tbody></table>`;
                                    }
                                    else {
                                        noidung = "Không có dữ liệu doanh thu cho khoảng thời gian này.";
                                    }
                                    $('#dt-thang').html(noidung);

                                    var data_gui_di3 = {
                                        action: 'tinh_doanh_thu',
                                        tienthu: tienthune,
                                        tienchi: tienchine,
                                        doanhthu: doanhthune
                                    }
                                    $.post(api, data_gui_di3, function (data) {
                                        console.log(data_gui_di);
                                        var json = JSON.parse(data);
                                        //alert("da gui thanh cong");
                                    });
                                });
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

    

    function list_don_nhap() {
        $.confirm({
            title: "Danh sách đơn nhập",
            content: '' +
                '<div id="ds_don_hang_nhap">Loading......</div>',
            columnClass: 'col-md-12',
            type: 'green',
            typeAnimated: true,
            buttons: {
                add: {
                    text: "Thêm đơn",
                    btnClass: 'btn-green any-other-class',
                    action: function () {
                        them_don_nhap();
                        return false;
                    }
                },
                xemdonxoa: {
                    text: "Xem đơn nhập đã xóa",
                    btnClass: 'btn-green any-other-class',
                    action: function () {
                        donnhapdaxoa();
                        return false;
                    }
                },
                xemdondone: {
                    text: "Xem đơn nhập đã done",
                    btnClass: 'btn-green any-other-class',
                    action: function () {
                        donnhapdadone();
                        return false;
                    }
                },
                Close: {
                    btnClass: 'btn-red any-other-class'
                }
            },

            onContentReady: function () {
                capnhatdonnhap();
            }
        });
    }

    function capnhatdonnhap() {
        $.post(api, { action: 'list_don_nhap' },
            function (data) {
                var json = JSON.parse(data);
                var noidung = "";
                if (json.ok) {
                    noidung += `<table class="table table-hover">`;
                    noidung += `<thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đơn nhập</th>
                        <th>Ngày nhập</th>
                        <th>Mã xưởng</th>
                        <th>Tên xưởng</th>
                        <th>Số điện thoại</th>
                        <th>Tên bánh</th>
                        <th>Số lượng</th>
                        <th>Size</th>
                        <th>Tổng tiền</th>
                    </tr>
                    </thead><tbody>`;
                    var stt = 0;
                    for (var dhn of json.data) {//moi 1 don hang trong json thi lam gi (lay thuoc tinh moi don hang )
                        var sua_xoa = ` <button class="btn btn-sm btn-danger nut-sua-xoa" data-idd="${dhn.madonnhap}" data-action="xoa_don_nhap">Xóa</button>`;
                        sua_xoa += ` <button class="btn btn-sm btn-success nut-sua-xoa" data-idd="${dhn.madonnhap}" data-action="done_don_nhap">Hoàn thành</button>`;
                        noidung += `
                        <tr>
                            <td>${++stt}</td>
                            <td>${dhn.madonnhap}</td>
                            <td>${dhn.ngaynhap}</td>
                            <td>${dhn.mancc}</td>
                            <td>${dhn.tenncc}</td>
                            <td>${dhn.sdtncc}</td>
                            <td>${dhn.tenbanh}</td>
                            <td>${dhn.sln}</td>
                            <td>${dhn.size}</td>
                            <td>${dhn.tongtiennhap}đ</td>
                            <td>${sua_xoa}</td>
                        </tr>`;
                    }
                    noidung += "</tbody></table>"
                }
                else {
                    noidung = "khong co du lieu";
                }
                $('#ds_don_hang_nhap').html(noidung);
                $('.nut-sua-xoa').click(function () {
                    if (checkAccess(quyen) == 1 || checkAccess(quyen) == 3) {
                        var action = $(this).data('action')  //lấy action kèm theo
                        var madonnhap = $(this).data('idd')  //lấy cid kèm theo
                        if (action == 'xoa_don_nhap') { //dùng action
                            //can xac nhan
                            xoa_don_nhap(madonnhap, json);
                            //dùng id vào đây để hàm này xử, cho khỏi rối code
                        }
                        else if (action == 'done_don_nhap') {
                            done_don_nhap(madonnhap, json);
                        }
                    } else {
                        alert("Bạn không có đủ quyền để thao tác")
                        return false;
                    }
                });
            }
        )
    }

    function done_don_nhap(madonnhap, json) {
        var don;
        for (var obj of json.data) {
            if (obj.madonnhap == madonnhap) {
                don = obj;
                break;
            }
        }
        var dialog_done = $.confirm({
            title: `Xác nhận hoàn thành đơn ${don.madonnhap}`,
            content: `Are you sure ?`,
            buttons: {
                YES: {
                    btnClass: 'btn-green any-other-class',
                    action: function () {
                        var data_gui_di = {
                            action: 'done_don_nhap',
                            madonnhap: madonnhap,
                        }
                        $.post(api, data_gui_di, function (data) {
                            var json = JSON.parse(data);
                            if (json.ok) {
                                dialog_done.close();
                                capnhatdonnhap();
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

    function donnhapdadone() {
        $.confirm({
            title: "Danh sách đơn hàng nhập đã hoàn thành",
            content: `<div id="ds_nhap_done">Loading......</div>`,
            columnClass: 'col-md-12',
            type: 'green',
            typeAnimated: true,
            onContentReady: function () {
                donnhapdone();
            }
        });
    }

    function donnhapdone() {
        $.post(api, { action: 'don_nhap_da_done' },
            function (data) {
                var json = JSON.parse(data);
                var noidung = "";
                if (json.ok) {
                    noidung += `<table class="table table-hover">`;
                    noidung += `<thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đơn nhập</th>
                        <th>Mã nhà cung cấp</th>
                        <th>Tên nhà cung cấp</th>
                        <th>Ngày nhập</th>
                        <th>Tổng tiền</th>
                        <th>Ngày hoàn thành</th>
                    </tr>
                    </thead><tbody>`;
                    var stt = 0;
                    for (var dh of json.data) {//moi 1 don hang trong json thi lam gi (lay thuoc tinh moi don hang )
                        noidung += `
                        <tr>
                            <td>${++stt}</td>
                            <td>${dh.madonnhap}</td>
                            <td>${dh.mancc}</td>
                            <td>${dh.tenncc}</td>
                            <td>${dh.ngaynhap}</td>
                            <td>${dh.tongtiennhap}</td>
                            <td>${dh.doneat}</td>
                        </tr>`;
                    }
                    noidung += "</tbody></table>"
                }
                else {
                    noidung = " khong co du lieu";
                }
                $('#ds_nhap_done').html(noidung);
            }
        )
    }

    function them_don_nhap() {
        var dialog_add = $.confirm({
            title: `Thêm mới đơn nhập`,
            type: 'green',
            typeAnimated: true,
            content: '' +
                '<label>Tên nhà cung cấp:</label>' + '<input class="name form-control" id="ten-ncc">' +
                '<label>Mã nhà cung cấp</label>' + '<input class="name form-control" id="ma-ncc">' +
                '<label>SDT</label>' + '<input class="name form-control" id="sdt-ncc">' +
                '<label style = "margin-top:10px"> Ngày nhập:</label>' + '<input style = "margin-top:10px" id = "ngay-nhap" type="datetime-local" name="datePicker"><br>' +
                '<label style = "margin-top:10px">Tên bánh:</label>' +
                `<select name="tenbanh" style = "margin-top:10px" id= "ten-banh">
                <option value="Pizza Margherita">Pizza Margherita</option>
                <option value="Pizza thập cẩm">Pizza thập cẩm</option>
                <option value="Pizza bò">Pizza bò bằm</option>
                <option value="Pizza biển khơi">Pizza hải sản</option>
                <option value="Pizza Hawaii">Pizza Hawaii</option>
                <option value="Pizza phô mai">Pizza phô mai</option>
                </select><br>` +
                `<label style = "margin-top:10px">Size:</label>` +
                `<select style = "margin-left:35px" name="size" id="size">
				    <option value="S">S</option>
				    <option value="M">M</option>
				    <option value="L">L</option>
			    </select><br>`+
                `<label style = "margin-top:10px">Số lượng:</label>` + '<input style = "margin-top:10px" id="sln"><br>',
            buttons: {
                save: {
                    text: `Thêm đơn hàng vào database`,
                    btnClass: 'btn-green any-other-class',
                    action: function () {
                        $.confirm({
                            title: `Thông báo`,
                            content: `Bạn đã kiểm tra kỹ chưa vì không có sửa đâu?`,
                            buttons: {
                                ok: {
                                    text: `Rồi`,
                                    btnClass: 'btn-green any-other-class',
                                },
                                no: {
                                    btnClass: 'btn-red any-other-class'
                                }
                            }
                        });
                        var tenncc = $('#ten-ncc').val();
                        var mancc = $('#ma-ncc').val();
                        var sdtncc = $('#sdt-ncc').val();
                        var ngaynhap = $('#ngay-nhap').val();
                        var tenbanh = $('#ten-banh').val();
                        var size = $('#size').val();
                        var sln = $('#sln').val();
                        if (tenncc === "" || mancc === "" || sdtncc === "" || ngaynhap === "" || tenbanh === "" || size === "" || sln === "") {
                            alert("Hãy nhập đủ dữ liệu");
                            return false;
                        }
                        else {
                            var data_gui_di = {
                                action: 'them_don_nhap',
                                tenncc: tenncc,
                                mancc: mancc,
                                sdtncc: sdtncc,
                                ngaynhap: ngaynhap,
                                tenbanh: tenbanh,
                                size: size,
                                sln: sln
                            }
                            $.post(api, data_gui_di, function (data) {
                                console.log(data_gui_di);
                                var json = JSON.parse(data);
                                if (json.ok) {
                                    dialog_add.close();
                                    capnhatdonnhap();
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
    } //mắc date trùng -> giải pháp: Lấy datetime-local

    function xoa_don_nhap(madonnhap, json) {
        var don;
        for (var obj of json.data) {
            if (obj.madonnhap == madonnhap) {
                don = obj;
                break;
            }
        }
        var dialog_xoa = $.confirm({
            title: `Xác nhận xóa đơn ${don.madonnhap}`,
            content: `Are you sure ?`,
            buttons: {
                YES: {
                    btnClass: 'btn-green any-other-class',
                    action: function () {
                        var data_gui_di = {
                            action: 'xoa_don_nhap',
                            madonnhap: madonnhap,
                        }
                        $.post(api, data_gui_di, function (data) {
                            var json = JSON.parse(data);
                            if (json.ok) {
                                dialog_xoa.close();
                                capnhatdonnhap();
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

    function donnhapdaxoa() {
        $.confirm({
            title: "Danh sách đơn nhập đã xóa",
            content: `<div id="ds_xoa_dn">Loading......</div>`,
            columnClass: 'col-md-12',
            type: 'green',
            typeAnimated: true,
            onContentReady: function () {
                donnhapxoa();
            }
        });
    }

    function donnhapxoa() {
        $.post(api, { action: 'don_nhap_da_xoa' },
            function (data) {
                var json = JSON.parse(data);
                var noidung = "";
                if (json.ok) {
                    noidung += `<table class="table table-hover">`;
                    noidung += `<thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đơn nhập</th>
                        <th>Mã nhà cung cấp</th>
                        <th>Tên nhà cung cấp</th>
                        <th>Ngày xóa</th>
                    </tr>
                    </thead><tbody>`;
                    var stt = 0;
                    for (var dh of json.data) {//moi 1 don hang trong json thi lam gi (lay thuoc tinh moi don hang )
                        noidung += `
                        <tr>
                            <td>${++stt}</td>
                            <td>${dh.madonnhap}</td>
                            <td>${dh.mancc}</td>
                            <td>${dh.tenncc}</td>
                            <td>${dh.delat}</td>
                        </tr>`;
                    }
                    noidung += "</tbody></table>"
                }
                else {
                    noidung = " khong co du lieu";
                }
                $('#ds_xoa_dn').html(noidung);
            }
        )
    }

    $('#messagekh').click(function () {
        var dialog_add = $.confirm({
            title: `Phản hồi vói cửa hàng`,
            type: 'green',
            typeAnimated: true,
            content: '' + '<label>Tên của bạn</label>' + '<input class="name form-control" placeholder="Tên" id="ten-kh">' +
                '<label>Tên bánh: </label>' + 
                `<select name="tenbanh" style = "margin-left:5px; margin-top:5px" id= "ten-banh">
                <option value="Pizza Margherita">Pizza Margherita</option>
                <option value="Pizza thập cẩm">Pizza thập cẩm</option>
                <option value="Pizza bò">Pizza bò bằm</option>
                <option value="Pizza biển khơi">Pizza hải sản</option>
                <option value="Pizza Hawaii">Pizza Hawaii</option>
                <option value="Pizza phô mai">Pizza phô mai</option>
                </select><br>` +
                '<label>Phản hồi</label><br>' + `<textarea id="noi-dung" style="width: 300px;
            height: 80px;
            padding: 10px;
            font-size: 16px;
            border: 2px solid #3498db;
            border-radius: 5px;
            word-wrap: break-word;" class="large-input" placeholder="Nhập vào đây"></textarea>`
            ,
            buttons: {
                save: {
                    text: `Gửi`,
                    btnClass: 'btn-green any-other-class',
                    action: function () {
                        var tenkh = $('#ten-kh').val();
                        var tenbanh = $('#ten-banh').val();
                        var noidung = $('#noi-dung').val();
                        if (checkdau(tenkh) == false) {
                            alert("xin điền đủ họ tên có dấu")
                            return false;
                        }
                        if (tenkh === "" || tenbanh === "" || noidung === "" ) {
                            alert("Hãy nhập đủ dữ liệu");
                            return false;
                        }
                        else {
                            var data_gui_di = {
                                action: 'nhan_phan_hoi',
                                tenkh: tenkh,
                                tenbanh: tenbanh,
                                noidung: noidung,
                            }
                            $.post(api, data_gui_di, function (data) {
                                console.log(data_gui_di);
                                var json = JSON.parse(data);
                                alert("Chúng tôi đã lưu lại phản hồi của bạn");
                            });
                        }
                    }
                },
                close: {
                    btnClass: 'btn-red any-other-class'
                }
            }
        });
    });

    $('#messageql').click(function () {
        $.confirm({
            title: "Danh sách phản hồi",
            content: '' +
                '<div id="ds_phan_hoi">Loading......</div>',
            columnClass: 'col-md-12',
            type: 'green',
            typeAnimated: true,
            buttons: {
                Close: {
                    btnClass: 'btn-red any-other-class'
                }
            },

            onContentReady: function () {
                phanhoikh();
            }
        });
    })

    function phanhoikh() {
        $.post(api, { action: 'xem_phan_hoi' },
            function (data) {
                var json = JSON.parse(data);
                var noidung = "";
                if (json.ok) {
                    noidung += `<table class="table table-hover">`;
                    noidung += `<thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên khách hàng</th>
                        <th>Tên bánh</th>
                        <th>Nội dung</th>
                    </tr>
                    </thead><tbody>`;
                    var stt = 0;
                    for (var dh of json.data) {//moi 1 don hang trong json thi lam gi (lay thuoc tinh moi don hang )
                        noidung += `
                        <tr>
                            <td>${++stt}</td>
                            <td>${dh.tenkh}</td>
                            <td>${dh.tenbanh}</td>
                            <td>${dh.noidung}</td>
                        </tr>`;
                    }
                    noidung += "</tbody></table>"
                }
                else {
                    noidung = "khong co du lieu";
                }
                $('#ds_phan_hoi').html(noidung);
            }
        )
    }

    $('#xem-don-nhap').click(function () {
        if (checkAccess(quyen) == 1) {
            list_don_nhap();
        }
        else if (checkAccess(quyen) == 0) {
            alert("Bạn cần đăng nhập để sử dụng chức năng này");
        }
        else if (checkAccess(quyen) == 2) {
            alert("Bạn không đủ quyền để thực hiện ")
        }
        else if (checkAccess(quyen) == 3) {
            list_don_nhap();
        }
    });

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
        else if (checkAccess(quyen) == 3) {
            alert("Bạn không đủ quyền để thực hiện ")
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
        else if (checkAccess(quyen) == 3) {
            alert("Bạn không đủ quyền để thực hiện ")
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
        else if (checkAccess(quyen) == 3) {
            alert("Bạn không đủ quyền để thực hiện ")
        }
    });
    
    $('#don-da-done').click(function () {
        if (checkAccess(quyen) == 1) {
            dondadone();
        }
        else if (checkAccess(quyen) == 0) {
            alert("Bạn cần đăng nhập để sử dụng chức năng này");
        }
        else if (checkAccess(quyen) == 2) {
            dondadone();
        }
        else if (checkAccess(quyen) == 3) {
            alert("Bạn không đủ quyền để thực hiện ")
        }
    });
})

//-------------------------------------------------------------