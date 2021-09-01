const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const fs = require('fs');
const wbm = require('./wa-service');
const util = require('util');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "laundry",
});

fs.createWriteStream(__dirname + '/file/qrcode.txt', { flags: 'w' });
var log_file = fs.createWriteStream(__dirname + '/file/log.txt', { flags: 'w' });
var log_stdout = process.stdout;

console.log = function (d) { //
  log_file.write(getTime() + ' >> ' + util.format(d) + '\n');
  log_stdout.write(getTime() + ' >> ' + util.format(d) + '\n');
}

const sendReport = (nama, handphone, blastType, tgl_masuk) => {
  var pesan = '';
  var pesanSingle = fs.readFileSync('./file/pesanSingle.txt', 'utf8');
  var pesanBroadcast = fs.readFileSync('./file/pesanBroadcast.txt', 'utf8');
  var merged = pesanSingle.replace("(?)", nama)
  var nomor = handphone;

  wbm.start().then(async () => {
    if (blastType === '1') {
      pesan = pesanBroadcast
    }
    else { pesan = merged, nomor = [nomor] }
    await wbm.send(nomor, pesan, tgl_masuk, blastType);
    await wbm.end();
  }).catch(err => console.log(err));
}

getDate = (date) => {
  let d = new Date(date);
  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return ye + '-' + mo + '-' + da;
}

getTime = () => {
  let d = new Date();
  let hh = new Intl.DateTimeFormat('en', { hour: '2-digit' }).format(d);
  let mm = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);
  let ss = new Intl.DateTimeFormat('en', { second: '2-digit' }).format(d);
  return getTglMasuk() + ' ' + hh + ':' + mm + ':' + ss;
}

getTglMasuk = () => {
  let d = new Date();
  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

  return `${ye}-${mo}-${da}`;
};

getTglMasuk = () => {
  let d = new Date();
  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return `${ye}-${mo}-${da}`;
};

getTglSelesai = (addDate) => {
  let d = new Date();
  d.setDate(d.getDate() + addDate);
  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return `${ye}-${mo}-${da}`;
};

getHargaTotal = (hargaPerKg, berat, diskon) => {
  if (diskon !== 0) { return ((hargaPerKg * berat) - ((diskon / 100) * (hargaPerKg * berat))) }
  else { return (hargaPerKg * berat) }
}

app.post("/addTransaction", (req, res) => {
  const nama = req.body.nama;
  const handphone = req.body.handphone;
  const jenis = req.body.jenis;
  const berat = req.body.berat;
  const paket = req.body.paket;
  const lama_cuci = req.body.lama_cuci;
  const hargaPerKg = req.body.harga;
  const diskon = req.body.diskon;
  const hargaTotal = getHargaTotal(hargaPerKg, berat, diskon)
  const keterangan = req.body.keterangan;
  const status = 'Proses';
  const tgl_masuk = getTglMasuk();
  const tgl_selesai = getTglSelesai(lama_cuci);

  db.query(
    "INSERT INTO customer (nama, handphone) VALUES (?,?)",
    [nama, handphone],
    async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        await db.query(
          "INSERT into transaction(customer_id, berat, paket, harga, jenis, tgl_masuk, tgl_selesai, status, keterangan, report)" +
          "VALUES((SELECT id FROM customer ORDER BY id DESC LIMIT 1), ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [berat, paket, hargaTotal, jenis, tgl_masuk, tgl_selesai, status, keterangan, 0]
        );
        res.send("Values Inserted");
      }
    }
  );
});

app.post("/addPaket", (req, res) => {
  const nama_paket = req.body.namaPaket;
  const lama_cuci = req.body.lamaCuci;
  const harga = req.body.harga;
  const diskon = req.body.diskon;

  db.query(
    "INSERT INTO paket (nama_paket, lama_cuci, harga, diskon) VALUES (?,?,?,?)",
    [nama_paket, lama_cuci, harga, diskon],
    async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.get("/transactions", (req, res) => {
  db.query("select customer.nama, customer.handphone, transaction.* from customer INNER JOIN transaction on transaction.customer_id = customer.id", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/getTransactionById/:id", (req, res) => {
  const id = req.params.id;
  db.query("select customer.nama, customer.handphone, transaction.* from customer INNER JOIN transaction on transaction.customer_id = customer.id where transaction.id = ?", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/paket", (req, res) => {
  db.query("select * from paket", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/updatePaket", (req, res) => {
  const id = req.body.id;
  const namaPaket = req.body.namaPaket;
  const lamaCuci = req.body.lamaCuci;
  const harga = req.body.harga;

  db.query(
    "UPDATE paket SET nama_paket = ?, lama_cuci = ?, harga = ? where id = ?",
    [namaPaket, lamaCuci, harga, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/deletePaket/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "delete from paket where id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.put("/update", (req, res) => {
  const nama = req.body.nama;
  const handphone = req.body.handphone;
  const tgl_masuk = req.body.tgl_masuk;

  db.query(
    "UPDATE transaction INNER JOIN customer ON transaction.customer_id = customer.id " +
    "SET transaction.status = 'Selesai' " +
    "WHERE customer.handphone = ? and transaction.tgl_masuk = ?",
    [handphone, getDate(tgl_masuk)],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
  // sendReport(nama, handphone, '0', getDate(tgl_masuk));
});


app.get("/getMessage", (req, res) => {
  var listMessage = []
  var pesanSingle = fs.readFileSync('./file/pesanSingle.txt', 'utf8');
  var pesanBroadcast = fs.readFileSync('./file/pesanBroadcast.txt', 'utf8');
  listMessage.push(pesanSingle)
  listMessage.push(pesanBroadcast)
  res.send(JSON.stringify(listMessage));
});

app.put("/updateMessage", (req, res) => {
  var tipe = req.body.tipe;
  var message = req.body.message;
  if (tipe === 'Single') {
    fs.writeFileSync('./file/pesanSingle.txt', message);
  } else {
    fs.writeFileSync('./file/pesanBroadcast.txt', message);
  }
  res.send('Message is updated!!');
});

app.put("/updatePhone", (req, res) => {
  var listPhone = req.body.handphone;
  sendReport(' ', listPhone, '1', ' ');
  res.send('Phone is updated and already to broadcast!!');
});

app.get("/getCustomers", (req, res) => {
  db.query("select nama, handphone FROM customer", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/readLogFile", async (req, res) => {
  var log = fs.readFileSync('./file/log.txt', 'utf8');
  var qrcode = fs.readFileSync('./file/qrcode.txt', 'utf8');
  await res.send({ log: log, qrcode: qrcode });
});

app.put("/sendReport", async (req, res) => {
  const nama = req.body.nama;
  const handphone = req.body.handphone;
  const tgl_masuk = req.body.tgl_masuk;
  await sendReport(nama, handphone, '0', getDate(tgl_masuk));
});


app.listen(3001, () => {
  process.stdout.write("Yey, your server is running on port 3001");
});
