const getBaseLog = (x, y) => {
  return Math.log(y) / Math.log(x);
};

const otpGenerator = () => {
	const len = 127;
	const lfsr = [];	
	const bTemp = [];
  const Langford_xor = [];

  for(let i=0; i<len; i++){
    lfsr[i] = Math.floor(Math.random() * 2);
  }

  lfsr[126]=1;
    
	for (let i = 0; i < len; ++i) {
		bTemp[i] = lfsr[i];
	}

 // Primitive polynomial p(x)=x^127 + x^113 + x^109 + x^107 + x^103 + x^101 + x^97 + x^89 + x^83 + x^79 + x^73 + x^71 + x^67 + x^61 + x^59 + x^53 + x^47 + x^43 + x^41 + x^37 + 1
  const Feedback = (bTemp[126] + bTemp[112] + bTemp[108] + bTemp[106] + bTemp[102] + bTemp[100] + bTemp[96] + bTemp[88] + bTemp[82] + bTemp[78] + bTemp[72] + bTemp[70] + bTemp[66] + bTemp[60] + bTemp[58] + bTemp[52] + bTemp[46] + bTemp[42] + bTemp[40] + bTemp[36] + 1) % 2;
  output = bTemp[126];
  for (i = len - 1; i > 0; --i) {
    bTemp[i] = bTemp[i - 1];
  }

  // add Feedback
  bTemp[0] = Feedback;

  for(i = 0; i < 30; i++){
      Langford_xor[i] = (bTemp[i*2+1]+bTemp[126-i*2]) %2;
  }
    
  let decimalOTP = 0; 
  for(i=0; i<30; i++){
      decimalOTP += Math.pow(Langford_xor[i] * 2, 29-i);
  }

  let digits = Math.floor(getBaseLog(10, decimalOTP) + 1);
  while(digits !== 9) {
    decimalOTP = Math.floor(decimalOTP / 10);
    digits = Math.floor(getBaseLog(10, decimalOTP) + 1);
  }

  return decimalOTP + '';
};

module.exports = otpGenerator;
