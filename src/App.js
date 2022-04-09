import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import app from "./firebase.init";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";

const auth = getAuth(app);
function App() {
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState('')
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleEmailBlur = (event) => {
    setEmail(event.target.value);
  };

  const handleNameBlur = (event) => {
    setName(event.target.value);
  };
  const handlePasswordBlur = (event) => {
    setPassword(event.target.value);
  };

  const handleRegisteredChange = (event) => {
    setRegistered(event.target.checked);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError("password should contain at least one character!");
      return;
    }
    setValidated(true);
    setError("");
    if (registered) {
      console.log(email, password);
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
          setEmail("");
          setPassword("");
          verifyEmail();
          setUserName();
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        });
    }

    event.preventDefault();
  };

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email).then(() => {
      console.log("email sent");
    });
  };
  const  setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    })
    .then(()=>{
      console.log('updating name');
    })
    .catch(error =>{
      setError(error.message)
    })
  }
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      console.log("email verification sent");
    });
  };

  return (
    <div>
      <div className="registration w-50 mx-auto mt-3">
        <h2 className="text-primary">
          Please {registered ? "Login" : "Register"}
        </h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          {
            !registered && <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                onBlur={handleNameBlur}
                type="text"
                placeholder="Your Name"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide your name.
              </Form.Control.Feedback>
            </Form.Group>
          }

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onBlur={handleEmailBlur}
              type="email"
              placeholder="Enter email"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onBlur={handlePasswordBlur}
              type="password"
              placeholder="Password"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              onChange={handleRegisteredChange}
              type="checkbox"
              label="Already registered?"
            />
          </Form.Group>
          <p className="text-danger">{error}</p>
          <Button onClick={handlePasswordReset} variant="link">
            Forget Password
          </Button>
          <br />
          <Button variant="primary" type="submit">
            {registered ? "Login" : "Register"}
          </Button>
        </Form>
      </div>

      {/* <form onSubmit={handleFormSubmit}>
      <input onBlur={handleEmailBlur} type="email" name="" id="1" />
      <br/>
      <input onChange={handlePasswordBlur} type="password" name="" id="2" />
      <br />
      <input type="submit" value="Login" />
    </form> */}
    </div>
  );
}

export default App;
