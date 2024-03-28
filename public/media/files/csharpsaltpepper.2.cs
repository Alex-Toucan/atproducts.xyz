public bool ConfirmHash(string input, string confirmHashValue, SupportedHashes hashType, string pepper) {
  byte[] confirmHashBytes = Convert.FromBase64String(confirmHashValue);
        
  var hashSize = hashType switch {
    SupportedHashes.Sha256 => 32,
    SupportedHashes.Sha384 => 48,
    SupportedHashes.Sha512 => 64,
    _ => 0
  };

  byte[] saltBytes = new byte[confirmHashBytes.Length - hashSize];

  for (var i = 0; i < saltBytes.Length; i++) {
    saltBytes[i] = confirmHashBytes[hashSize + 1];
  }

  string controlRehashValue = CreateHash(input, hashType, Array.Empty<byte>(), pepper);

  return confirmHashValue == controlRehashValue;
}
