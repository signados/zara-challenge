import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { useFavorites } from '../../services/FavoritesContext';
import './Characters.css';
import { Link } from 'react-router-dom';

interface Character {
          id: number;
          name: string;
          imageUrl: string;
}

interface ApiResponse {
          [x: string]: Character[] | null;
}

const Characters: React.FC = () => {
          const VITE_ENDPOINT_CHARACTERS = import.meta.env.VITE_ENDPOINT_CHARACTERS as string;
          const { favorites, toggleFavorite } = useFavorites();

          const [q, setQ] = useState<string>("");
          const [filterFavorites, setFilterFavorites] = useState<boolean>(false);
          const [params, setParams] = useState<Record<string, string>>({});

          const { loading, error, data } = useFetch<ApiResponse>(VITE_ENDPOINT_CHARACTERS, params);

          useEffect(() => {
                    if (q) {
                              setParams({ nameStartsWith: q });
                    } else {
                              setParams({});
                    }
          }, [q]);

          const searchFavorites = (items: Character[], query: string): Character[] => {
                    return items.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
          };

          return (
                    <>
                              <input
                                        type="search"
                                        name="search-form"
                                        placeholder="Buscar..."
                                        value={q}
                                        onChange={(e) => setQ(e.target.value)}
                              />
                              <input
                                        type="checkbox"
                                        checked={filterFavorites}
                                        onChange={() => setFilterFavorites(!filterFavorites)}
                              />
                              {loading && <p>Loading...</p>}
                              {error && <p>Error: {error.message}</p>}
                              <br />
                              <ul>
                                        {data && data.results && (filterFavorites
                                                  ? searchFavorites(Array.from(favorites), q).map((character: Character) => (
                                                            <li key={character.id}>
                                                                      <Link to={`/character/${character.id}`}>{character.name}</Link>
                                                                      <button onClick={() => toggleFavorite(character)}>
                                                                                {Array.from(favorites).some(fav => fav.id === character.id) ? 'Unfavorite' : 'Favorite'}
                                                                      </button>
                                                            </li>
                                                  ))
                                                  : searchFavorites(data.results, q).map((character: Character) => (
                                                            <li key={character.id}>
                                                                      <Link to={`/character/${character.id}`}>{character.name}</Link>
                                                                      <button onClick={() => toggleFavorite(character)}>
                                                                                {Array.from(favorites).some(fav => fav.id === character.id) ? 'Unfavorite' : 'Favorite'}
                                                                      </button>
                                                            </li>
                                                  )))
                                        }
                              </ul>
                    </>
          );
};

export default Characters;
