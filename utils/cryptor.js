import crypto from 'crypto';//built-in node module for cryptography

const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgQDQe0yadspLeiPXEwJa9Io+TG+56BBwquyaJGq1ws9rn+Aw1/yA
W20oWTTf0HGxIn7lSIMJ7dgIgLHL/xC5WrdYPEWqdByMizIa1i5bj7AUuHv8smor
hsa/zpHB69BvgFE80YGlhS7jgXzHLhJ4BvzsPxKCuKjfarbOYHSyW7oijQIDAQAB
AoGAVdbuq4rNsFYR+7Qv/BND+HKwbfNHEZzO3oiwBza3ALFLNdE4fgEm6L4SLzU8
GpsBdJZund/4W0fh7QSQdkELy+IAmbsL0SD2LGoJuAdQl4A9Ngb223s1LE9dbNR/
cDcqx66piekGsnj8veOj1C3rBJN6L3U7+/BYmfrUwF27mgECQQD40fdMAQJAUZ2Y
phh5S6tgSCn48pP88uereVcWYvwZivooxXAis2jKb0EfJHpCG9VGj4okaTOi/Iya
MJD26rJxAkEA1n9aPzQXVuAPCUHPaTCVz+xE1W0/LMWUi72a26+9agJ1HeiG36Fl
AvUFB7QCALGN/cKe3+KcQZMl40VQgI0H3QJAUQv7VEtj01WCUu2PPTszmEoJOeix
4YuxgH4mqskVOrC1KUCedP8hXAb/HEjCdfQg9TneElweELHYjoTRQ0xRUQJAJOHv
HbESVlDepQPY60h8ai1BRMWtOECdI04uA5p7YnAbvVHPZ0K0QMbq34E3WvEs7jZ5
5RttLOVlfWfcyM33TQJAZvGn3FXgUTIloJie+0VQCfM2kzD06CeHhzvRh2PS2y2L
FNu5IYoRdgD6gtArkE7qGwHoANHaNDgsd5T453+Rbg==
-----END RSA PRIVATE KEY-----`;

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDQe0yadspLeiPXEwJa9Io+TG+5
6BBwquyaJGq1ws9rn+Aw1/yAW20oWTTf0HGxIn7lSIMJ7dgIgLHL/xC5WrdYPEWq
dByMizIa1i5bj7AUuHv8smorhsa/zpHB69BvgFE80YGlhS7jgXzHLhJ4BvzsPxKC
uKjfarbOYHSyW7oijQIDAQAB
-----END PUBLIC KEY-----`;

const algorithm = 'aes-256-ctr';
const iv = crypto.randomBytes(16);

const encrypt = (data) => {
    const cipher = crypto.createCipheriv(algorithm,PRIVATE_KEY,iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

    return {
        iv:iv.toString('hex'),
        content:encrypted.toString('hex')
    }
}

const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv(algorithm,PUBLIC_KEY,Buffer.from(hash.iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content,'hex')), decipher.final()]);

    return decrypted.toString();
}

export {encrypt, decrypt}