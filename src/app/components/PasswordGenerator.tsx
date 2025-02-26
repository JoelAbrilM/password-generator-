'use client'; // Esto indica que este es un componente de cliente

import React, { useState } from 'react';
import crypto from 'crypto';
import AdComponent from './AdsComponent';

const PasswordGenerator = () => {
  const [length, setLength] = useState(8); // Password length
  const [keywords, setKeywords] = useState(['', '', '']); // Keywords
  const [encryption, setEncryption] = useState('none'); // Encryption type
  const [password, setPassword] = useState(''); // Generated password

  // Array of month endings for letter substitution
  const monthEndings: { [key: string]: string } = {
    a: 'May', b: 'February', c: 'December', d: 'September', e: 'June',
    f: 'January', g: 'August', h: 'March', i: 'November', j: 'October',
    k: 'April', l: 'July', m: 'December', n: 'March', o: 'September',
    p: 'May', q: 'October', r: 'February', s: 'January', t: 'December',
    u: 'August', v: 'April', w: 'June', x: 'May', y: 'February', z: 'July'
  };

  // Function to generate random characters with requirements
  const generateRandomChars = (length: number) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let randomChars = '';
    let hasUppercase = false;
    let hasNumber = false;
    let hasSymbol = false;

    while (randomChars.length < length) {
      const randomChar = charset.charAt(Math.floor(Math.random() * charset.length));
      randomChars += randomChar;

      // Check if the random character satisfies requirements
      if (/[A-Z]/.test(randomChar)) hasUppercase = true;
      if (/\d/.test(randomChar)) hasNumber = true;
      if (/[!@#$%^&*()]/.test(randomChar)) hasSymbol = true;
    }

    // Ensure the password has at least one uppercase, one number, and one symbol
    if (!hasUppercase || !hasNumber || !hasSymbol) {
      return generateRandomChars(length); // Retry if not met
    }

    return randomChars.replace(/\s+/g, ''); // Remove any spaces if present
  };

  // Custom encryption algorithm: AprilHash
  const AprilHash = (text: string) => {
    let result = '';
    for (let char of text) {
      if (/[a-zA-Z]/.test(char)) {
        const lowerChar = char.toLowerCase();
        const month = monthEndings[lowerChar] || 'X';
        result += month.slice(-1); // Take the last letter of the month
      } else if (/\d/.test(char)) {
        // Multiply number by Pi and get the middle number
        const pi = Math.PI;
        const resultNum = char.charCodeAt(0) * pi;
        const middleDigit = Math.floor((resultNum % 10));
        result += middleDigit.toString();
      } else {
        result += char; // Symbols stay the same
      }
    }
    return result;
  };

  // Function to generate the password
  const generatePassword = () => {
    // Filter out empty keywords and remove spaces from them
    const validKeywords = keywords
      .filter(keyword => keyword.trim() !== '') // Remove empty or whitespace-only keywords
      .map(keyword => keyword.replace(/\s+/g, '')); // Remove any spaces within the keywords

    let basePassword = validKeywords.join('') || 'defaultKey'; // If no keywords, use 'defaultKey'

    // Generate random characters if necessary
    if (basePassword.length < length) {
      basePassword += generateRandomChars(length - basePassword.length);
    }

    // Encrypt or not based on selected encryption
    const finalPassword = encryption === 'AprilHash' ? AprilHash(basePassword) : basePassword;

    // Remove spaces from the final password and limit it to the desired length
    setPassword(finalPassword.replace(/\s+/g, '').substring(0, length));
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-orange-800 via-orange-600 to-orange-500 p-6">
      <div className="bg-black p-8 rounded-lg shadow-lg max-w-lg w-full border-4 border-orange-700 mb-16">
        <h1 className="text-4xl font-extrabold text-center text-orange-600 mb-6">Password Generator</h1>

        {/* Password length */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-white mb-2">Password Length:</label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full p-3 bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            min={1}
            max={64}
          />
        </div>

        {/* Keywords */}
        <div className="mb-4 flex space-x-2">
          <label className="block text-sm font-semibold text-white mb-2">Keywords:</label>
          {keywords.map((keyword, index) => (
            <input
              key={index}
              type="text"
              value={keyword}
              onChange={(e) => {
                const newKeywords = [...keywords];
                newKeywords[index] = e.target.value;
                setKeywords(newKeywords);
              }}
              className="w-full sm:w-1/3 p-3 bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2"
              placeholder={`Keyword ${index + 1}`}
            />
          ))}
        </div>

        {/* Encryption type */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-white mb-2">Encryption Type:</label>
          <select
            value={encryption}
            onChange={(e) => setEncryption(e.target.value)}
            className="w-full p-3 bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="none">No Encryption</option>
            <option value="AprilHash">AprilHash</option>
          </select>
        </div>

        {/* Generate button */}
        <button
          onClick={generatePassword}
          className="w-full p-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Generate Password
        </button>

        {/* Generated password */}
        <div className="mt-6 p-4 bg-gray-900 rounded-md text-center text-xl font-semibold">
          <span className="text-orange-400">Generated Password: </span>
          <span className="text-orange-600">{password || '---'}</span>
        </div>
      </div>

      {/* AdComponent as Footer */}
      <div className="w-full mt-auto">
        <AdComponent />
      </div>
    </div>
  );
};

export default PasswordGenerator;
