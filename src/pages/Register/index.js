import { useState } from 'react'
import './register.css';

import { Link } from 'react-router-dom';

import { auth } from '../../firebaseConnection';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { useNavigate } from 'react-router-dom';

import { toast } from "react-toastify";

function Register(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    async function handleRegister(e){
        e.preventDefault();

        if (email !== '' && password !== '') {

            await createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                toast.success("Usuário cadastrado com sucesso!");
                setEmail('');
                setPassword('');

                setTimeout(() => {
                    navigate('/', {replace: true});
                }, 1500);
            })
            .catch((error) => {
                console.log("Error.: " + error.code);

                switch (error.code) {
                    case "auth/weak-password":
                        toast.error("Tente digitar uma senha mais forte :/");
                    break;

                    case "auth/too-many-requests":
                        toast.error("Excesso de tentativas... tente mais tarde :/");
                    break;

                    case "auth/email-already-in-use":
                        toast.error("Hmmm, esse e-mail já está em uso, tente usar outro!")
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
            toast.warn("Preencha todos os campos");
        }

    }

    return(
        <div className='home-container'>
            <h1>Cadastre-se</h1>
            <span>Vamos criar sua conta.</span>

            <form className='form' onSubmit={handleRegister}>
                <input type="text" placeholder='Digite seu E-mail...' onChange={(e) => setEmail(e.target.value)}/>
                <input type='password' placeholder='******' onChange={(e) => setPassword(e.target.value)} autoComplete="false"/>
                <button type="submit">Cadastrar</button>
            </form>

            <Link to="/" className='button-link'>
                Já possui uma conta? Faça login!
            </Link>
        </div>
    )
}

export default Register;