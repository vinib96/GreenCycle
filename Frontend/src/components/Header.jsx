import { useState , useEffect} from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import Cart from './Cart';
import Nav from './Nav';

import { useAuth } from '../contexts/AuthContext';
import Search from './Search';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

import { checkToken } from '../utils/auth';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userWindow, setUserWindow] = useState(false)

  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const { isLoggedIn, user, login, logout } = useAuth();
  const navigate = useNavigate();
  const {
    cartItems,
    removeItemFromCart,
    discountCode,
    handleApplyDiscount,
    setDiscountCode,

    addItemToCart,
  } = useCart();

  const [token, setToken] = useState(localStorage.getItem('token'))

  // CHECK IF THERE'S A TOKEN
  async function tokenCheck() {
    token ? handleLogin() : console.log('no token')
  }

  // Handle successful login
  const handleLogin = async () => {
    try {
      const data = await checkToken(token)
      console.log(data)
      login(data)
    } catch (err) {console.log(err)}
  }

  useEffect(() =>{
    tokenCheck();
  },[])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleCart = () => {
    setIsCartOpen((prevState) => !prevState);
  };

  const onLogout = () => {
    localStorage.removeItem('token')
    setUserWindow(false)
    logout();
    navigate('/')
  }

  return (
    <div className='header'>
      <div className='header__top'>
        <h1 className='header__logo'>
          <Link to={'/'}>
            <img src='./assets/logo.svg' alt='logo' />
          </Link>
        </h1>
        <Search />
        <div className='header__icons'>
          {' '}
          {!isLoginPage && !isRegisterPage && isLoggedIn && (
            <>
              {' '}
              <button onClick={toggleCart}>
                <img
                  src='/assets/shopping_bag.svg'
                  alt='account icon'
                  className='account-icon'
                />
              </button>
              <button onClick={()=> {setUserWindow(true)}}>
                <img
                  src='/assets/accountIcon.svg'
                  alt='account icon'
                  className='account-icon'
                />
              </button>
              {userWindow && <div className='header__user-wrapper'>
                <button className='header__close-button' onClick={() => {setUserWindow(false)}}>X</button>
                <span className='header__username'>Olá, {user?.name}</span>
                <button className='header__logout-button' onClick={onLogout}>LOGOUT</button>
              </div>}
            </>
          )}
          {!isLoggedIn && !isLoginPage && !isRegisterPage && (
            <div className='header__corner-menu'>
              <button onClick={toggleCart}>
                <img
                  src='/assets/shopping_bag.svg'
                  alt='account icon'
                  className='account-icon'
                />
              </button>
              <div className='header__login-box'>
                <Link className='header__login-button' to={'/login'}>
                  LOGIN
                </Link>
                <p className='header__signup-link'>
                  ou <Link to={'/register'} className='header__signup-link'>crie sua conta</Link>
                </p>
              </div>
            </div>
          )}
          <button onClick={toggleMenu}>
            <img
              src='/assets/menu.svg'
              alt='menu icon'
              className='account-icon header__hamburguer'
            />
          </button>
        </div>
      </div>
      <Nav />
      <div className={menuOpen ? 'header__menu_open' : 'header__menu'}>
        <Search menuOpen={menuOpen} />
        <Nav menuOpen={menuOpen} />
      </div>{' '}
      {isCartOpen && (
        <Cart
          cartItems={cartItems}
          addItemToCart={addItemToCart}
          removeItemFromCart={removeItemFromCart}
          discountCode={discountCode}
          setDiscountCode={setDiscountCode}
          handleApplyDiscount={handleApplyDiscount}
          toggleCart={toggleCart}
        />
      )}
      <div className='header__line' />
    </div>
  );
}

export default Header;
