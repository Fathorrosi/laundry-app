import "./userList.css";
import { DataGrid } from "@material-ui/data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Axios from "axios";
import Swal from 'sweetalert2'

export default function UserList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/transactions").then((response) => {
      setData(response.data);
    });
  }, [])

  const updateTransaction = (id, nama, handphone, tgl_masuk) => {
    Axios.put("http://localhost:3001/update",
      { id: id, nama: nama, handphone: handphone, tgl_masuk: tgl_masuk });
  };

  const formatter = (value) => {
    return (value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  const updateStatus = (status, id, nama, handphone, tgl_masuk) => {
    Swal.fire({
      title: 'Apakah kamu yakin?',
      text: "Status akan menjadi " + setStatus(status),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update!'
    }).then((result) => {
      if (result.isConfirmed) {
        updateTransaction(id, nama, handphone, tgl_masuk);
        Swal.fire({
          icon: 'success',
          title: 'Status berhasil diupdate!!',
          showConfirmButton: false,
          timer: 1000
        })
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      }
    })
  }

  const setStatus = (status) => {
    if (status === 'Proses') { return 'Selesai' }
    if (status === 'Selesai') { return 'Selesai' }
  }

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "nama",
      headerName: "Nama",
      width: 160,
    },
    {
      field: "harga",
      headerName: "Tagihan",
      width: 160,
      valueFormatter: (params) => {
        return 'Rp. ' + formatter(params.value);
      },
    },
    {
      field: "tgl_selesai",
      headerName: "Estimasi selesai",
      width: 180,
      valueFormatter: (params) => {
        var date = new Date(params.value)
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => {
        return (
          <>
            {params.row.status === 'Selesai' ? (
              <button className="statusSelesai">{params.row.status}</button>
            ) : (
              <button className="statusProses">{params.row.status}</button>
            )}
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 400,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/detail/" + params.row.id}>
              <button className="userListDetail">Detail</button>
            </Link>
            {/* <Link to={"/detail/" + params.row.id}> */}
            <button disabled={params.row.status === 'Selesai'} onClick={() =>
              updateStatus(params.row.status, params.row.id, params.row.nama,
                params.row.handphone, params.row.tgl_masuk)}
              className="userListUpdate">Update Status</button>
            {params.row.report === 1 ? (
              <button className="statusSelesai">Report terkirim</button>
            ) : (
              <button className="statusProses">Report tidak terkirim</button>
            )}
            {/* </Link> */}
            {/* <DeleteOutline
              className="userListDelete"
              onClick={() => navigate(params.row.id)}
            /> */}
          </>
        );
      },
    },
  ];

  return (
    <div className="userList">
      <DataGrid
        rows={data}
        disableSelectionOnClick
        columns={columns}
        pageSize={10}
      // checkboxSelection
      />
    </div>
  );
}
