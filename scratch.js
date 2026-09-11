fetch('https://upload.wikimedia.org/wikipedia/commons/e/e2/BYD_Auto_2022_logo.svg').then(r => console.log(r.status)).catch(e => console.error(e.message));
