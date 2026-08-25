import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Orbita Compass Backend API Documentation',
      version: '1.0.0',
      description: 'API Server untuk Platform Analitik & Mentor Akademik AI Siswa SMA/SMK/MA Indonesia (Orbita Compass)',
      contact: {
        name: 'Orbita Compass Engineering Team',
        url: 'https://github.com/mauinGit/Orbita-Compass'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server (Local)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Masukkan JWT Token yang didapat dari endpoint POST /auth/login'
        }
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Pesan kesalahan sistem' },
            timestamp: { type: 'string', example: '2026-08-24T21:40:00.000Z' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'c123456789' },
            email: { type: 'string', example: 'siswa@orbita.id' },
            name: { type: 'string', example: 'Siswa Demo' },
            role: { type: 'string', example: 'STUDENT' },
            school: { type: 'string', example: 'SMA Negeri 1 Jakarta' },
            grade: { type: 'integer', example: 12 },
            majorTrack: { type: 'string', example: 'IPA' }
          }
        },
        University: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'u-ui' },
            name: { type: 'string', example: 'Universitas Indonesia' },
            code: { type: 'string', example: 'UI' },
            city: { type: 'string', example: 'Depok' },
            province: { type: 'string', example: 'Jawa Barat' },
            type: { type: 'string', example: 'PTN-BH' },
            accreditation: { type: 'string', example: 'Unggul' }
          }
        },
        Major: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'm-ui-si' },
            universityId: { type: 'string', example: 'u-ui' },
            name: { type: 'string', example: 'Sistem Informasi' },
            category: { type: 'string', example: 'Saintek' },
            snbpQuota: { type: 'integer', example: 45 },
            snbtQuota: { type: 'integer', example: 90 },
            mandiriQuota: { type: 'integer', example: 45 },
            passingGradeEstimate: { type: 'number', example: 88.5 }
          }
        },
        QuestionItem: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'q-tka-1' },
            category: { type: 'string', example: 'tka' },
            subtest: { type: 'string', example: 'Fisika' },
            campus: { type: 'string', example: 'UI' },
            question: { type: 'string', example: 'Berapakah kecepatan sudut benda...' },
            options: {
              type: 'array',
              items: { type: 'string' },
              example: ['10 rad/s', '20 rad/s', '30 rad/s', '40 rad/s']
            },
            answerIndex: { type: 'integer', example: 1 },
            difficultyWeight: { type: 'number', example: 1.2 }
          }
        }
      }
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Autentikasi'],
          summary: 'Daftar akun siswa/guru baru',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'name'],
                  properties: {
                    email: { type: 'string', example: 'siswa.baru@orbita.id' },
                    password: { type: 'string', example: 'password123' },
                    name: { type: 'string', example: 'Siswa Baru' },
                    school: { type: 'string', example: 'SMA N 1 Jakarta' },
                    grade: { type: 'integer', example: 12 },
                    majorTrack: { type: 'string', example: 'IPA' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Registrasi berhasil' },
            400: { description: 'Email sudah terdaftar atau input tidak valid' }
          }
        }
      },
      '/auth/login': {
        post: {
          tags: ['Autentikasi'],
          summary: 'Login akun & dapatkan Bearer JWT Token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'siswa@orbita.id' },
                    password: { type: 'string', example: 'password123' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Login berhasil, mengembalikan token JWT dan profil user' },
            401: { description: 'Kredensial tidak valid' }
          }
        }
      },
      '/auth/me': {
        get: {
          tags: ['Autentikasi'],
          summary: 'Ambil profil user yang sedang login',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Data user login' },
            401: { description: 'Unauthorized / Token invalid' }
          }
        }
      },
      '/profile': {
        get: {
          tags: ['Profil & Rapor'],
          summary: 'Ambil detail profil siswa lengkap (termasuk nilai rapor semester 1-5 & prestasi)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Detail profil siswa' }
          }
        },
        put: {
          tags: ['Profil & Rapor'],
          summary: 'Update data profil siswa',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Profil berhasil diperbarui' }
          }
        }
      },
      '/rapor': {
        get: {
          tags: ['Profil & Rapor'],
          summary: 'Ambil nilai rapor per semester',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Daftar nilai rapor' } }
        },
        post: {
          tags: ['Profil & Rapor'],
          summary: 'Simpan/update nilai rapor siswa',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Rapor disimpan' } }
        }
      },
      '/compass/analyze': {
        post: {
          tags: ['Orbita Compass AI'],
          summary: 'Jalankan analisis AI keselarasan minat x bakat x rapor',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Analisis AI Gemini berhasil diproses' }
          }
        }
      },
      '/compass/result': {
        get: {
          tags: ['Orbita Compass AI'],
          summary: 'Ambil hasil analisis AI terakhir',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Hasil analisis AI' } }
        }
      },
      '/ptn/universities': {
        get: {
          tags: ['Eksplor PTN & CBT'],
          summary: 'Ambil daftar universitas / PTN (Public access)',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 30 } },
            { name: 'city', in: 'query', schema: { type: 'string' } },
            { name: 'type', in: 'query', schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'Daftar universitas dengan pagination' } }
        }
      },
      '/ptn/majors': {
        get: {
          tags: ['Eksplor PTN & CBT'],
          summary: 'Ambil daftar program studi (Public access)',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 25 } },
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'search', in: 'query', schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'Daftar prodi dengan pagination' } }
        }
      },
      '/ptn/rationalization': {
        get: {
          tags: ['Eksplor PTN & CBT'],
          summary: 'Kalkulasi rasionalisasi peluang kelulusan SNBP',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Skor SNBP & kategori peluang' } }
        }
      },
      '/ptn/practice/questions': {
        get: {
          tags: ['Eksplor PTN & CBT'],
          summary: 'Ambil bank soal CBT (UTBK, SKD, TKA, Mandiri)',
          parameters: [
            { name: 'category', in: 'query', schema: { type: 'string', example: 'utbk' }, description: 'Kategori: utbk | skd | tka | mandiri' },
            { name: 'campus', in: 'query', schema: { type: 'string', example: 'UI' }, description: 'Kode/Nama kampus untuk ujian mandiri (opsional)' }
          ],
          responses: { 200: { description: 'Bank soal CBT' } }
        }
      },
      '/ptn/practice/submit': {
        post: {
          tags: ['Eksplor PTN & CBT'],
          summary: 'Submit jawaban tryout & kalkulasi skor CBT (IRT 0-1000 / SKD 0-550)',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Skor tryout berhasil dihitung' } }
        }
      },
      '/action-plans': {
        get: {
          tags: ['Action Plan'],
          summary: 'Ambil daftar agenda persiapan siswa',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Daftar agenda' } }
        },
        post: {
          tags: ['Action Plan'],
          summary: 'Buat agenda persiapan baru',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Agenda berhasil dibuat' } }
        }
      },
      '/bk/teachers': {
        get: {
          tags: ['Konsultasi Guru BK'],
          summary: 'Daftar Guru BK yang tersedia',
          responses: { 200: { description: 'Daftar Guru BK' } }
        }
      },
      '/bk/bookings': {
        get: {
          tags: ['Konsultasi Guru BK'],
          summary: 'Riwayat booking konsultasi siswa',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Daftar booking' } }
        },
        post: {
          tags: ['Konsultasi Guru BK'],
          summary: 'Buat janji konsultasi baru',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Booking berhasil' } }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

export const swaggerSpec = swaggerJSDoc(options);
