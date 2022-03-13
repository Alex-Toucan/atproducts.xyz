import base64

with open('test.txt', 'rb') as f:
    encoded_str = base64.b64encode(f.read())

print('-' *79)
print('test.txt file encoded as:')
print('-' *79)
print(encoded_str)
print('-' *79)

with open('test-enc64.txt', 'wb') as f:
    f.write(encoded_str)

with open('test-enc64.txt', 'rb') as f:
    decoded_str = base64.b64decode(f.read())
print('test.txt file decoded back again:')
print('-' *79)
print(decoded_str)

with open('test-decoded.txt', 'wb') as f:
    f.write(decoded_str)
