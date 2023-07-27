import { useEffect, useState } from "react";
import { auth, db } from '../../firebaseConnection';
import { signOut } from 'firebase/auth';

import { toast } from "react-toastify";

import {
    updateDoc,  // atualiza um doc a partir de um target, value
    doc,        // indicar um documento específico de uma coleção (db, "collection", id do documento(PK/Row)), usado como target de delete/update
    deleteDoc,  // deletar um doc dentro da collection
    query,      // prepara para montar uma query especifica passando a ref do collection
    orderBy,    // ordenar registros (Coluna, Ordenar por Crescente/Decrescente)
    where,      // condicionar registros (Coluna, Operador("==", ">", "<", "<="...), Valor)
    onSnapshot, // ficar constantemente escutando alguma mudança no db e atualizar registros (QQ vou ficar olhando?, Faço o que? (Geralmente função anonima (snapshot) => {}))
    addDoc,     // adicionar um registro (PK/Row) dentro da collection
    collection  // mapear collection e document (Conexão, CollectionRef)
} from 'firebase/firestore';

import "./admin.css";

function Admin(){

    const [tarefaInput, setTarefaInput] = useState('');
    const [user, setUser] = useState({});
    const [edit, setEdit] = useState({});

    const [tarefas, setTarefas] = useState([]);

    useEffect(() => {
        async function loadTarefas(){
            const userDetail = localStorage.getItem("@detailUser");

            setUser(JSON.parse(userDetail));
            
            if (userDetail) {
                const data = JSON.parse(userDetail);
                const tarefaRef = collection(db, "tarefas");
                const q = query(tarefaRef, orderBy("created", "desc"), where("userUid", "==", data?.uid));

                const unsub = onSnapshot(q, (snapshot) => {
                    let lista = [];

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().userUid
                        })
                    })

                    setTarefas(lista)
                });

            }
        }

        loadTarefas();
    }, []);

    async function handleRegister(e){
        e.preventDefault();

        if(tarefaInput === ''){
            toast.warn("Por favor preencha com uma tarefa");
            return;
        }

        if (edit?.id) {
            handleUpdateTarefa();
            return;
        }

        await addDoc(collection(db, "tarefas"), {
            tarefa: tarefaInput,
            created: new Date(),
            userUid: user?.uid
        })
        .then(() => {
            setTarefaInput('');
            toast.success("Tarefa cadastrada com sucesso! :D");
        })
        .catch((error) =>{
            console.log("Erro ao adicionar tarefa: " + error.code)
            toast.error("Ops, aconteceu um erro :/");
        })
    }

    async function deteleTarefa(id){
        const docRef = doc(db, "tarefas", id);
        
        await deleteDoc(docRef)
        .then(() => {
            toast.success("Tarefa concluída!");
        })
        .catch((error) =>{
            console.log("Erro ao deletar tarefa: " + error.code)
            toast.error("Ops, aconteceu um erro :/");
        });
    }

    // pq o item não o id? :( ... para quando for atualizar, sejá atualizado por completo e já com os campos necessários :D
    async function editTarefa(item){
        setTarefaInput(item.tarefa);
        setEdit(item);
    }

    async function handleUpdateTarefa(){
        const docRef = doc(db, "tarefas", edit?.id);
        await updateDoc(docRef, {
            tarefa: tarefaInput
        })
        .then(() => {
            toast.success("Tarefa atualizada!");
        })
        .catch((error) => {
            console.log("Error.: " + error);
            toast.error("Ops, aconteceu um erro :/");
        })

        setEdit({});
        setTarefaInput('');
    }

    async function handleLogout(){
        await signOut(auth);
    }

    return(
        <div className="admin-container">
            <h1>Minhas tarefas</h1>

            <form className="form" onSubmit={handleRegister}>
                <textarea placeholder="Digite sua tarefa..." value={tarefaInput} onChange={(e) => setTarefaInput(e.target.value)}/>
                
                {Object.keys(edit).length > 0 ? (
                    <button className="btn-register" style={{backgroundColor: '#6add39' }} type="submit">Atualizar tarefa</button>
                ) : (
                    <button className="btn-register" type="submit">Registrar tarefa</button>
                )}
            </form>

            {tarefas.length > 0 ? tarefas.map((item) => (
                <article className="list" key={item.id}>
                    <p>{item.tarefa}</p>

                    <div>
                        <button className="btn-editar" onClick={ () => editTarefa(item)}>Editar</button>
                        <button className="btn-delete" onClick={ () => deteleTarefa(item.id) }>Concluir</button>
                    </div>
                </article>                
            )) : (
                <div>
                    <h2>Cadastre uma tarefa! :D</h2>
                </div>
            )}


            <button className="btn-logout" onClick={handleLogout}>Sair</button>
        </div>
    );
}

export default Admin;