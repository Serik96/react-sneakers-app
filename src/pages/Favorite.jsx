import React from 'react';
import Card from '../components/Card/Card.js';
import { AppContext } from '../App.js';

function Favorite({ onAddtoFavorite }) {
  const { favorite } = React.useContext(AppContext);

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои закладки</h1>
        <div className="search-block d-flex"></div>
      </div>

      <div className="d-flex flex-wrap">
        {favorite.map((item, index) => (
          <Card
            key={index}
            favorited={true}
            onFavorite={onAddtoFavorite}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}

export default Favorite;
