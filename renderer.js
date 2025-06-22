const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

let currentInput = '';  // input yang tampil di display (string)
let lastPressed = '';   // simpan tombol terakhir untuk validasi

// Fungsi format angka ribuan, jutaan, dll (pakai titik) dan koma sebagai desimal
function formatNumber(num) {
  if (num === '') return '';
  if (num === '.') return '0,';
  let [integer, decimal] = num.toString().split('.');
  // Hapus dulu titik yang mungkin sudah ada biar gak double format
  integer = integer.replace(/\./g, '');
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return decimal !== undefined ? `${formattedInteger},${decimal}` : formattedInteger;
}

// Fungsi ubah display format ribuan jadi format normal (hilangkan titik, ganti koma ke titik)
function unformatNumber(str) {
  if (!str) return '';
  return str.replace(/\./g, '').replace(',', '.');
}

// Fungsi update display (pakai formatNumber)
function updateDisplay(value) {
  display.value = formatNumber(value);
}

// Event klik tombol
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const btnVal = btn.textContent;

    flashButton(btn);

    if (btn.classList.contains('number')) {
      if (lastPressed === '=') {
        currentInput = ''; // reset setelah hasil hitung
      }
      // Tambah angka (tapi cek jangan ada lebih dari 1 koma)
      if (btnVal === ',' && currentInput.includes(',')) return;
      currentInput += btnVal;
      updateDisplay(currentInput);

    } else if (btn.classList.contains('operator')) {
      if (currentInput === '') return; // ga boleh operator duluan
      if ('+-/*'.includes(lastPressed)) {
        // ganti operator terakhir
        currentInput = currentInput.slice(0, -1) + btnVal;
      } else {
        currentInput += btnVal;
      }
      updateDisplay(currentInput);
    } else if (btn.classList.contains('clear')) {
      currentInput = '';
      updateDisplay(currentInput);
    } else if (btn.classList.contains('equal')) {
      if (currentInput === '') return;
      try {
        // Ubah format angka ke bentuk yang bisa dihitung
        let expression = currentInput
          .replace(/\./g, '') // hapus titik
          .replace(/,/g, '.'); // ganti koma ke titik

        // Jangan izinkan operator terakhir
        if ('+-/*'.includes(expression.slice(-1))) {
          expression = expression.slice(0, -1);
        }

        let result = eval(expression);
        if (typeof result === 'number') {
          currentInput = result.toString();
          updateDisplay(currentInput);
        }
      } catch {
        updateDisplay('Error');
        currentInput = '';
      }
    }

    lastPressed = btnVal;
  });
});

// Fungsi animasi flash tombol
function flashButton(button) {
  button.classList.add('flash');
  setTimeout(() => {
    button.classList.remove('flash');
  }, 150);
}

// Keyboard support
window.addEventListener('keydown', (e) => {
  const key = e.key;

  // Cari tombol yang sesuai dengan keyboard
  let btn = null;

  if ((key >= '0' && key <= '9') || key === ',') {
    btn = [...buttons].find(b => b.textContent === key);
  } else if ('+-/*'.includes(key)) {
    btn = [...buttons].find(b => b.textContent === key);
  } else if (key === 'Enter' || key === '=') {
    btn = [...buttons].find(b => b.classList.contains('equal'));
  } else if (key.toLowerCase() === 'c') {
    btn = [...buttons].find(b => b.classList.contains('clear'));
  }

  if (btn) {
    btn.click();
    e.preventDefault();
  }
});
