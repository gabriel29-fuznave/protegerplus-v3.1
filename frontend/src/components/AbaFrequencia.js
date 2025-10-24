import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object({
  nome: Yup.string().required('Nome obrigatório'),
  idade: Yup.number().required('Idade obrigatória').positive().integer(),
  frequencia: Yup.string(),
  status: Yup.string(),
});

function AbaFrequencia({ token }) {
  const [alunos, setAlunos] = useState([]);

  const fetchAlunos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/alunos', { headers: { Authorization: token } });
      setAlunos(res.data);
    } catch (error) { 
      console.error('Erro ao carregar alunos:', error);
      alert('Erro ao carregar alunos'); 
    }
  };

  useEffect(() => { fetchAlunos(); }, [token]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post('http://localhost:3001/alunos', values, { headers: { Authorization: token } });
      resetForm();
      fetchAlunos();
    } catch (error) { 
      console.error('Erro ao salvar aluno:', error);
      alert('Erro ao salvar aluno'); 
    }
  };

  const handleDelete = async (id) => {
    try { 
      await axios.delete(`http://localhost:3001/alunos/${id}`, { headers: { Authorization: token } }); 
      fetchAlunos(); 
    } 
    catch (error) { 
      console.error('Erro ao deletar aluno:', error);
      alert('Erro ao deletar aluno'); 
    }
  };

  return (
    <div>
      <h2>Ficha de Frequência</h2>
      <Formik initialValues={{ nome: '', idade: '', frequencia: '', status: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form>
          <div><label>Nome:</label><Field name="nome" /><ErrorMessage name="nome" component="div" style={{ color: 'red' }} /></div>
          <div><label>Idade:</label><Field name="idade" type="number" /><ErrorMessage name="idade" component="div" style={{ color: 'red' }} /></div>
          <div><label>Frequência:</label><Field name="frequencia" /></div>
          <div><label>Status:</label><Field name="status" /></div>
          <button type="submit">Adicionar Aluno</button>
        </Form>
      </Formik>
      <h3>Alunos Registrados</h3>
      <table border="1">
        <thead><tr><th>Nome</th><th>Idade</th><th>Frequência</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>{alunos.map(aluno => (<tr key={aluno.id}><td>{aluno.nome}</td><td>{aluno.idade}</td><td>{aluno.frequencia}</td><td>{aluno.status}</td><td><button onClick={() => handleDelete(aluno.id)}>Deletar</button></td></tr>))}</tbody>
      </table>
    </div>
  );
}

export default AbaFrequencia;
