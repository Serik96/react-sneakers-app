import React from 'react';
import styles from './Card.module.scss';
import { useState } from 'react';
import ContentLoader from 'react-content-loader';
import { AppContext } from '../../App.js';

function Card({
  id,
  imageUrl,
  title,
  price,
  onFavorite,
  onPlus,
  favorited = false,
  loading = false,
}) {
  const { isItemAdded } = React.useContext(AppContext);
  const [isFavorite, setIsFavorite] = useState(favorited);
  const obj = { id, parentId: id, title, imageUrl, price };

  const onClickPlus = () => {
    onPlus(obj);
  };

  const onClickFavorite = () => {
    onFavorite(obj);
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={styles.card}>
      {loading ? (
        <ContentLoader
          speed={2}
          width={190}
          height={210}
          viewBox="0 0 190 190"
          backgroundColor="#f2f2f2"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="0" rx="10" ry="10" width="150" height="91" />
          <rect x="0" y="165" rx="3" ry="3" width="80" height="24" />
          <rect x="119" y="160" rx="3" ry="3" width="32" height="32" />
          <rect x="0" y="110" rx="3" ry="3" width="150" height="11" />
          <rect x="0" y="130" rx="0" ry="0" width="93" height="15" />
        </ContentLoader>
      ) : (
        <>
          {onFavorite && (
            <div className={styles.favorite} onClick={onClickFavorite}>
              <img
                src={isFavorite ? 'img/liked.svg' : 'img/unliked.svg'}
                alt="Unliked"
              />
            </div>
          )}
          <img width="100%" height={135} src={imageUrl} alt="Sneakers" />
          <h5>{title}</h5>
          <div className="d-flex justify-between align-center">
            <div className="d-flex flex-column">
              <span>Цена:</span>
              <b>{price} тг.</b>
            </div>
            {onPlus && (
              <img
                className={styles.plus}
                onClick={onClickPlus}
                src={
                  isItemAdded(id) ? 'img/btn-checked.svg' : 'img/btn-plus.svg'
                }
                alt="Plus"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Card;
