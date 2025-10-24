require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const app = express();
app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Acesso negado' });
  // O token vem no formato "Bearer <token>", então precisamos remover o "Bearer "
  const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;
  
  jwt.verify(tokenValue, process.env.JWT_SECRET || 'secret_key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Simulação de usuário no banco de dados. Em produção, buscaria no DB.
  // Criando um hash para 'password' para simular um usuário válido 'epaz'
  // IMPORTANTE: Este hash deve ser gerado UMA VEZ e armazenado no DB. 
  // Aqui, ele é gerado a cada login para fins de demonstração.
  const storedUser = { username: 'epaz', passwordHash: await bcrypt.hash('password', 10) };
  
  const validPassword = await bcrypt.compare(password, storedUser.passwordHash);
  
  if (username === storedUser.username && validPassword) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

// Rotas para Casos
app.get('/casos', authenticateToken, async (req, res) => {
  try { const result = await pool.query('SELECT * FROM casos'); res.json(result.rows); } 
  catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao buscar casos' }); }
});

app.post('/casos', authenticateToken, async (req, res) => {
  const { titulo, descricao } = req.body;
  if (!titulo || !descricao) return res.status(400).json({ error: 'Campos obrigatórios' });
  try { await pool.query('INSERT INTO casos (titulo, descricao) VALUES ($1, $2)', [titulo, descricao]); res.json({ message: 'Caso criado' }); } 
  catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao criar caso' }); }
});

// Rotas para Alunos
app.get('/alunos', authenticateToken, async (req, res) => {
  try { const result = await pool.query('SELECT * FROM alunos'); res.json(result.rows); } 
  catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao buscar alunos' }); }
});

app.post('/alunos', authenticateToken, async (req, res) => {
  const { nome, idade, frequencia, status } = req.body;
  if (!nome || !idade) return res.status(400).json({ error: 'Nome e idade obrigatórios' });
  try { await pool.query('INSERT INTO alunos (nome, idade, frequencia, status) VALUES ($1, $2, $3, $4)', [nome, idade, frequencia || 'N/A', status || 'Ativo']); res.json({ message: 'Aluno criado' }); } 
  catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao criar aluno' }); }
});

app.put('/alunos/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { nome, idade, frequencia, status } = req.body;
  // Adicionando verificação de campos para PUT
  if (!nome && !idade && !frequencia && !status) return res.status(400).json({ error: 'Nenhum campo para atualizar fornecido' });
  
  try { 
    // Construção dinâmica da query para permitir atualização parcial
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (nome) { fields.push(`nome=$${paramIndex++}`); values.push(nome); }
    if (idade) { fields.push(`idade=$${paramIndex++}`); values.push(idade); }
    if (frequencia) { fields.push(`frequencia=$${paramIndex++}`); values.push(frequencia); }
    if (status) { fields.push(`status=$${paramIndex++}`); values.push(status); }

    values.push(id); // O último valor é o ID
    
    const query = `UPDATE alunos SET ${fields.join(', ')} WHERE id=$${paramIndex}`;
    
    const result = await pool.query(query, values); 
    
    if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    
    res.json({ message: 'Aluno atualizado' }); 
  } 
  catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao atualizar aluno' }); }
});

app.delete('/alunos/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try { 
    const result = await pool.query('DELETE FROM alunos WHERE id=$1', [id]); 
    
    if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    
    res.json({ message: 'Aluno deletado' }); 
  } 
  catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao deletar aluno' }); }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
