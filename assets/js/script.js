// Get all elements
const clearBtn = document.getElementById('clearBtn');
const codeEl = document.getElementById('code');
const output = document.getElementById('outputArea');
const cipherSelect = document.getElementById('cipherSelect');
const cipherKey = document.getElementById('cipherKey');
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');
const cipherHelp = document.getElementById('cipherHelp');

function append(msg, isError) {
  const line = document.createElement('div');
  line.textContent = msg;
  line.style.whiteSpace = 'pre-wrap';
  if (isError) line.style.color = '#ffb4b4';
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function clearOutput() {
  output.textContent = '';
}

clearBtn.addEventListener('click', () => {
  codeEl.value = '';
  clearOutput();
});

// Caesar cipher
function caesarShift(s, shift) {
  const aCode = 'a'.charCodeAt(0);
  const ACode = 'A'.charCodeAt(0);
  const wrap = (n, m) => ((n % m) + m) % m;
  return s.split('').map(ch => {
    const code = ch.charCodeAt(0);
    if (code >= ACode && code <= ACode + 25) {
      return String.fromCharCode(ACode + wrap(code - ACode + shift, 26));
    }
    if (code >= aCode && code <= aCode + 25) {
      return String.fromCharCode(aCode + wrap(code - aCode + shift, 26));
    }
    return ch;
  }).join('');
}

function caesarEncode(s, shift) { return caesarShift(s, shift); }
function caesarDecode(s, shift) { return caesarShift(s, -shift); }

// Atbash cipher
function atbash(s) {
  const aCode = 'a'.charCodeAt(0);
  const ACode = 'A'.charCodeAt(0);
  return s.split('').map(ch => {
    const code = ch.charCodeAt(0);
    if (code >= ACode && code <= ACode + 25) {
      return String.fromCharCode(ACode + (25 - (code - ACode)));
    }
    if (code >= aCode && code <= aCode + 25) {
      return String.fromCharCode(aCode + (25 - (code - aCode)));
    }
    return ch;
  }).join('');
}

// Vigenere cipher
function vigenereTransform(s, key, decode = false) {
  if (!key) throw new Error('Vigenère requires a key');
  const cleanKey = key.replace(/[^a-zA-Z]/g, '');
  if (!cleanKey) throw new Error('Vigenère key must contain letters');
  const aCode = 'a'.charCodeAt(0);
  const ACode = 'A'.charCodeAt(0);
  let ki = 0;
  return s.split('').map(ch => {
    const code = ch.charCodeAt(0);
    const kch = cleanKey[ki % cleanKey.length];
    const kshift = (kch.toLowerCase().charCodeAt(0) - aCode);
    if (code >= ACode && code <= ACode + 25) {
      const base = ACode;
      const shift = decode ? -kshift : kshift;
      ki++;
      return String.fromCharCode(base + ((code - base + shift + 26) % 26));
    }
    if (code >= aCode && code <= aCode + 25) {
      const base = aCode;
      const shift = decode ? -kshift : kshift;
      ki++;
      return String.fromCharCode(base + ((code - base + shift + 26) % 26));
    }
    return ch;
  }).join('');
}

function vigenereEncode(s, key) { return vigenereTransform(s, key, false); }
function vigenereDecode(s, key) { return vigenereTransform(s, key, true); }

// Base64 codec
function base64Encode(s) {
  try {
    return btoa(unescape(encodeURIComponent(s)));
  } catch (e) {
    throw new Error('Base64 encode failed: ' + e.message);
  }
}

function base64Decode(s) {
  try {
    return decodeURIComponent(escape(atob(s)));
  } catch (e) {
    throw new Error('Base64 decode failed: ' + e.message);
  }
}

function performTransform(type, input, key, decodeMode) {
  switch (type) {
    case 'caesar': {
      const shift = parseInt(key, 10);
      if (Number.isNaN(shift)) throw new Error('Caesar requires numeric key (shift)');
      return decodeMode ? caesarDecode(input, shift) : caesarEncode(input, shift);
    }
    case 'atbash': return atbash(input);
    case 'vigenere': return decodeMode ? vigenereDecode(input, key) : vigenereEncode(input, key);
    case 'base64': return decodeMode ? base64Decode(input) : base64Encode(input);
    case 'none': return input;
    default: throw new Error('Unknown cipher: ' + type);
  }
}

function handleEncodeDecode(decodeMode) {
  clearOutput();
  const type = cipherSelect.value || 'none';
  const key = cipherKey.value || '';
  const text = codeEl.value || '';
  try {
    const out = performTransform(type, text, key, decodeMode);
    append(out);
  } catch (err) {
    append(err.message || String(err), true);
  }
}

encodeBtn.addEventListener('click', () => handleEncodeDecode(false));
decodeBtn.addEventListener('click', () => handleEncodeDecode(true));

// Update UI based on selected cipher
function updateCipherUI() {
  const type = cipherSelect.value || 'none';
  switch (type) {
    case 'caesar':
      cipherKey.disabled = false;
      cipherKey.placeholder = 'Numeric shift, e.g. 3 or -2';
      cipherHelp.textContent = 'Caesar: shift letters by the numeric key (positive or negative).';
      break;
    case 'vigenere':
      cipherKey.disabled = false;
      cipherKey.placeholder = 'Alphabetic key, e.g. SECRET';
      cipherHelp.textContent = 'Vigenère: alphabetic key used to shift letters (ignore non-letters).';
      break;
    case 'atbash':
      cipherKey.disabled = true;
      cipherKey.placeholder = 'Key not required for Atbash';
      cipherHelp.textContent = 'Atbash: a simple substitution (A↔Z). No key required.';
      break;
    case 'base64':
      cipherKey.disabled = true;
      cipherKey.placeholder = 'Key not required for Base64';
      cipherHelp.textContent = 'Base64: encodes/decodes binary-safe textual data. No key required.';
      break;
    case 'none':
    default:
      cipherKey.disabled = true;
      cipherKey.placeholder = 'Select a cipher that requires a key';
      cipherHelp.textContent = 'Choose a cipher from the menu. Provide a key when required.';
      break;
  }
}

cipherSelect.addEventListener('change', updateCipherUI);
updateCipherUI();
