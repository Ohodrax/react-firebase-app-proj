import { useState } from 'react'
import './home.css';

import { Link } from 'react-router-dom';

import { auth } from '../../firebaseConnection';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { useNavigate } from 'react-router-dom';

import { toast } from "react-toastify";

function Home(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    
    async function handleLogin(e){
        e.preventDefault();
        
        if (email !== '' && password !== '') {
            
            await signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate('/admin', {
                    replace: true
                })
            })
            .catch((error) => {
                console.log("Error.: " + error.code);
                
                switch (error.code) {
                    case "auth/wrong-password":
                        toast.error("Sua senha está incorreta :/");
                    break;

                    case "auth/user-not-found":
                        toast.error("Este usuário não existe... já fez o cadastro?");
                    break;

                    case "auth/too-many-requests":
                        toast.error("Excesso de tentativas... tente mais tarde :/");
                    break;

                    case "auth/invalid-email":
                        toast.error("Digite um e-mail válido!");
                    break;
                
                    default:
                        toast.error("Ops, aconteceu um erro :/");
                    break;
                }
            })
        } else {
            toast.warn("Preencha todos os campos.");
        }

    }

    return(
        <div className='home-container'>
            <h1>Lista de Tarefas</h1>
            <span>Gerencie sua agenda de forma fácil.</span>

            <form className='form' onSubmit={handleLogin}>
                <input type="text" placeholder='Digite seu E-mail...' value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type='password' placeholder='******' value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="false"/>
                <button type="submit">Acessar</button>
            </form>

            <Link to="/register" className='button-link'>
                Não possui uma conta? Cadastre-se
            </Link>
        </div>
    )
}

export default Home;