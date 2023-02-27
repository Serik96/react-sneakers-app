import React from 'react';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.scss';
import 'macro-css';
import Header from './components/Header';
import Home from './pages/Home';
import Drawer from './components/Drawer';
import Favorite from './pages/Favorite';
import Orders from './pages/Orders';

export const AppContext = React.createContext({});

function App() {
  const [items, setItems] = useState([]);

  const [cartItems, setCartItems] = useState([]);

  const [cartOpened, setCartOpened] = useState(false);

  const [favorite, setFavorite] = useState([[]]);

  const [searchValue, setSearchValue] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [itemsResponse, cartResponse, favoriteResponse] =
          await Promise.all([
            axios.get('https://639e186d1ec9c6657bb9a046.mockapi.io/items'),
            axios.get('https://639e186d1ec9c6657bb9a046.mockapi.io/cart'),
            axios.get('https://639e186d1ec9c6657bb9a046.mockapi.io/favorite'),
          ]);

        setIsLoading(false);

        setItems(itemsResponse.data);
        setCartItems(cartResponse.data);
        setFavorite(favoriteResponse.data);
      } catch (error) {
        alert('Ошибка при запросе данных');
      }
    }
    fetchData();
  }, []);

  const onAddtoCart = async (obj) => {
    try {
      const findItem = cartItems.find(
        (item) => Number(item.parentId) === Number(obj.id)
      );
      if (findItem) {
        setCartItems((prev) =>
          prev.filter((item) => Number(item.parentId) !== Number(obj.id))
        );
        await axios.delete(
          `https://639e186d1ec9c6657bb9a046.mockapi.io/cart/${findItem.id}`
        );
      } else {
        setCartItems((prev) => [...prev, obj]);
        const { data } = await axios.post(
          'https://639e186d1ec9c6657bb9a046.mockapi.io/cart',
          obj
        );
        setCartItems((prev) =>
          prev.map((item) => {
            if (item.parentId === data.parentId) {
              return {
                ...item,
                id: data.id,
              };
            }
            return item;
          })
        );
      }
    } catch (error) {
      alert('Не удалось добавить в корзину');
    }
  };

  const oneRemoveItem = (id) => {
    try {
      axios.delete(`https://639e186d1ec9c6657bb9a046.mockapi.io/cart/${id}`);
      setCartItems((prev) =>
        prev.filter((item) => Number(item.id) !== Number(id))
      );
    } catch (error) {
      alert('Не удалось удалить из корзины');
    }
  };

  const onAddtoFavorite = async (obj) => {
    try {
      if (favorite.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        axios.delete(
          `https://639e186d1ec9c6657bb9a046.mockapi.io/favorite/${obj.id}`
        );
        // setFavorite((prev) =>
        //   prev.filter((item) => Number(item.id) === Number(obj.id))
        // );
      } else {
        const { data } = await axios.post(
          'https://639e186d1ec9c6657bb9a046.mockapi.io/favorite',
          obj
        );
        setFavorite((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты');
    }
  };

  const onChangeSearchInput = (e) => {
    setSearchValue(e.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  };

  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorite,
        isItemAdded,
        onAddtoFavorite,
        setCartOpened,
        setCartItems,
        onAddtoCart,
      }}
    >
      <div className="wrapper clear">
        <Drawer
          onRemove={oneRemoveItem}
          items={cartItems}
          onClose={() => {
            setCartOpened(false);
          }}
          opened={cartOpened}
        />

        <Header
          onClickCart={() => {
            setCartOpened(true);
          }}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                items={items}
                cartItems={cartItems}
                onAddtoFavorite={onAddtoFavorite}
                onAddtoCart={onAddtoCart}
                isLoading={isLoading}
              />
            }
          ></Route>

          <Route
            path="/favorite"
            element={<Favorite onAddtoFavorite={onAddtoFavorite} />}
          ></Route>

          <Route path="/orders" element={<Orders />}></Route>
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
