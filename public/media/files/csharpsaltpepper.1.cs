using System;
using System.Security.Cryptography;
using System.Text;

namespace Security.Hash;

public enum SupportedHashes {
  Sha256, Sha384, Sha512
}

public class Hasher {
  private static readonly Random Rnd = new();
  private static readonly RandomNumberGenerator Rng = RandomNumberGenerator.Create();

  public string CreateHash(string input, SupportedHashes hashType, byte[] salt, string pepper) {
    int minSaltLength = 12;
    int maxSaltLength = 16;
    byte[] saltBytes;
    byte[] pepperBytes = Encoding.UTF8.GetBytes(pepper);

    if (salt != Array.Empty<byte>()) {
      saltBytes = salt;
    } else {
      int saltLength = Rnd.Next(minSaltLength, maxSaltLength);
      saltBytes = new byte[saltLength];
      Rng.GetNonZeroBytes(saltBytes);
      Rng.Dispose();
    }

    byte[] inputData = Encoding.UTF8.GetBytes(input);
    byte[] inputDataAndSalt = new byte[input.Length + saltBytes.Length];
    byte[] inputDataAndSaltAndPepper = new byte[input.Length + saltBytes.Length + pepperBytes.Length];
    byte[] hashValue = Array.Empty<byte>();

    switch (hashType) {
      case SupportedHashes.Sha256:
        HMACSHA256 sha256 = new();
        hashValue = sha256.ComputeHash(inputDataAndSaltAndPepper);
        sha256.Dispose();
        break;
      case SupportedHashes.Sha384:
        HMACSHA384 sha384 = new();
        hashValue = sha384.ComputeHash(inputDataAndSaltAndPepper);
        sha384.Dispose();
        break;
      case SupportedHashes.Sha512:
        HMACSHA512 sha512 = new();
        hashValue = sha512.ComputeHash(inputDataAndSaltAndPepper);
        sha512.Dispose();
        break;
    }

    byte[] result = new byte[hashValue.Length + saltBytes.Length];

    for (var i = 0; i < hashValue.Length; i++) {
      result[i] = hashValue[i];
    }

    for (var i = 0; i < saltBytes.Length; i++) {
      result[hashValue.Length + i] = saltBytes[i];
    }
        
    return Convert.ToBase64String(result);
  }
}
