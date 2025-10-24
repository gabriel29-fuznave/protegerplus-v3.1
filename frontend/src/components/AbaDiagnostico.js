import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object({
  titulo: Yup.string().required('Título obrigatório'),
  descricao: Yup.string().required('Descrição obrigatória'),
});

function AbaDiagnostico({ token }) {
  const [casos, setCasos] = useState([]);

  const fetchCasos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/casos', { headers: { Authorization: token } });
      setCasos(res.data);
    } catch (error) {
      console.error('Erro ao carregar casos:', error);
      alert('Erro ao carregar casos');
    }
  };

  useEffect(() => { fetchCasos(); }, [token]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post('http://localhost:3001/casos', values, { headers: { Authorization: token } });
      resetForm();
      fetchCasos();
    } catch (error) { 
      console.error('Erro ao salvar caso:', error);
      alert('Erro ao salvar caso'); 
    }
  };

  return (
    <div>
      <h2>Ficha de Diagnóstico</h2>
      <Formik initialValues={{ titulo: '', descricao: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form>
          <div><label>Título:</label><Field name="titulo" /><ErrorMessage name="titulo" component="div" style={{ color: 'red' }} /></div>
          <div><label>Descrição:</label><Field as="textarea" name="descricao" /><ErrorMessage name="descricao" component="div" style={{ color: 'red' }} /></div>
          <button type="submit">Salvar Caso</button>
        </Form>
      </Formik>
      <h3>Casos Registrados</h3>
      <ul>{casos.map(caso => <li key={caso.id}>{caso.titulo}: {caso.descricao}</li>)}</ul>
    </div>
  );
}

export default AbaDiagnostico;
