import { db } from '../src/lib/firebase.js';
import { collection, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';

async function populateRelatorios() {
    await populateEmprestimos();
    await populateDevolucoes();
}

async function populateEmprestimos() {
    const emprestimosTable = document.getElementById('emprestimos-table').getElementsByTagName('tbody')[0];
    const emprestimosCollection = collection(db, 'emprestimos');
    const emprestimosSnapshot = await getDocs(emprestimosCollection);

    for (const emprestimoDoc of emprestimosSnapshot.docs) {
        const emprestimo = emprestimoDoc.data();
        const livroRef = doc(db, 'livros', emprestimo.livroId);
        const livroSnap = await getDoc(livroRef);
        const livro = livroSnap.exists() ? livroSnap.data() : { title: 'Desconhecido' };

        const row = emprestimosTable.insertRow();
        row.insertCell(0).innerText = emprestimo.ra;
        row.insertCell(1).innerText = emprestimo.livroId;
        row.insertCell(2).innerText = livro.title;
        row.insertCell(3).innerText = emprestimo.dataRetirada;
    }
}

async function populateDevolucoes() {
    const devolucoesTable = document.getElementById('devolucoes-table').getElementsByTagName('tbody')[0];
    const devolucoesCollection = collection(db, 'devolucoes');
    const devolucoesSnapshot = await getDocs(devolucoesCollection);

    for (const devolucaoDoc of devolucoesSnapshot.docs) {
        const devolucao = devolucaoDoc.data();
        const livroRef = doc(db, 'livros', devolucao.livroId);
        const livroSnap = await getDoc(livroRef);
        const livro = livroSnap.exists() ? livroSnap.data() : { title: 'Desconhecido' };

        const row = devolucoesTable.insertRow();
        row.insertCell(0).innerText = devolucao.ra;
        row.insertCell(1).innerText = devolucao.livroId;
        row.insertCell(2).innerText = livro.title;
        
        const dataDevolucao = devolucao.createdAt.toDate ? devolucao.createdAt.toDate().toLocaleDateString() : new Date(devolucao.createdAt).toLocaleDateString();
        row.insertCell(3).innerText = dataDevolucao;
    }
}

document.addEventListener('DOMContentLoaded', populateRelatorios);
