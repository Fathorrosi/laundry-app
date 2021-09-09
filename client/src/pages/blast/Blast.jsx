import "./Blast.css"
import { DataGrid } from "@material-ui/data-grid";
import { blastData } from "./data"
import { useState, useEffect } from "react";
import Axios from "axios";
import Swal from 'sweetalert2'
import QRCode from "react-qr-code";
import io from 'socket.io-client';


export default function Blast() {
    const [message, setMessage] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [log, setLog] = useState('');
    const [qrcode, setQrcode] = useState('');

    const socket = io('http://localhost:3001', {
        transports: ['websocket', 'polling']
    });

    useEffect(() => {
        Axios.get("http://localhost:3001/getMessage").then((response) => {
            setMessage(response.data);
        });
        Axios.get("http://localhost:3001/getCustomers").then((response) => {
            setCustomers(response.data);
        });
        var textarea = document.getElementById('log');
        socket.on('log', (data) => {
            setLog(data.log)
            setQrcode(data.qrcode)
            textarea.scrollTop = textarea.scrollHeight;
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleEdit = (tipe) => {
        Swal.fire({
            input: 'textarea',
            inputLabel: 'Message',
            inputPlaceholder: 'Type your message here...',
            inputAttributes: {
                'aria-label': 'Type your message here'
            },
            showCancelButton: true
        }).then(value => {
            if (value.value !== undefined) {
                Axios.put("http://localhost:3001/updateMessage", { message: value.value, tipe: tipe });
                Swal.fire({
                    icon: 'success',
                    title: 'Pesan berhasil diupdate!!',
                    showConfirmButton: false,
                    timer: 1000
                })
                setTimeout(() => {
                    window.location.reload(false);
                }, 1500);
            }
        })
    }

    const broadcastMessage = async () => {
        Swal.fire({
            title: 'Apakah kamu yakin?',
            text: "Pesan akan dikirimkan pada semua customer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Broadcast!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                var TemplistPhone = [];
                var listPhone = [];
                for (let index = 0; index < customers.length; index++) {
                    TemplistPhone.push(customers[index].handphone)
                }
                listPhone = [...new Set(TemplistPhone)];
                await Axios.put("http://localhost:3001/updatePhone", { handphone: listPhone })
            }
        })
    }

    const columns = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "tipe", headerName: "Tipe", width: 200 },
        {
            field: "pesan", headerName: "Pesan", width: 500,
            renderCell: (params) => {
                return (
                    <>
                        {message[(params.row.id) - 1]}
                    </>
                );
            },
        },
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <button onClick={() => handleEdit(params.row.tipe)} className="userListDetail">Edit</button>
                    </>
                );
            },
        }
    ];

    return (
        <div className="blast">
            <DataGrid
                rows={blastData}
                disableSelectionOnClick
                columns={columns}
                pageSize={5}
                className="blasttable"
            // checkboxSelection
            />
            <div className="broadcastBlast">
                <div className="blastQrcode">
                    <QRCode size="150" value={qrcode} />
                    <br></br>
                    <h5>Scan this barcode to </h5>
                    <h5>validate your Whatsapp</h5>
                </div>
                <div className="blastLog">
                    <h2>Log Broadcast</h2>
                    <textarea id="log" className="log" value={log}></textarea>
                </div>
                <div>
                    <button onClick={broadcastMessage} className="broadcastBlassBtn">Broadcast</button>
                </div>

            </div>
        </div>
    );
}
