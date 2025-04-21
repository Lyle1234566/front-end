import React, { useState, useEffect } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import RequestBook from '../requestBooks/RequestBook'

const SimilarBooks = () => {
  const { id } = useParams()

  const FetchSimilarBooks_API = `${backend_server}/api/v1/similarBooks/${id}`
  const [similarBooks, setSimilarBooks] = useState([])

  const { request_Book } = RequestBook()

  useEffect(() => {
    const fetchSimilarBooks = async () => {
      try {
        const response = await axios.get(FetchSimilarBooks_API)
        setSimilarBooks(response.data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchSimilarBooks()
  }, [])

  return (
    <div className='row mb-3'>
      <h2 className='h2 my-2'>Similar Books you might Like :</h2>
      {similarBooks.length > 0 ? (
        similarBooks.map((book) => {
          const { _id, title, image, author, available } = book
          const imgSrc = `${backend_server}/${image}`

          return (
            <div
              className='col-xxl-3 col-lg-3 col-md-4 col-sm-6 col-6 gy-3'
              key={_id}
            >
              <div className='card h-100'>
                <div className='card-img-top'>
                  <img
                    style={{ height: '100%', width: '100%' }}
                    className='img-fluid'
                    src={imgSrc}
                    alt='book image'
                  />
                </div>

                <div className='card-body'>
                  <h5 className='h5 card-title'>{title}</h5>
                  <p className='p card-text'>{author}</p>

                  {/* Star Rating */}
                  <div className='rating'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className='star filled'>
                        ★
                      </span>
                    ))}
                  </div>

                  <div className='form-group mb-2 justify-content-center d-flex'>
                    {available ? (
                      <button
                        type='button'
                        className='btn btn-primary me-2'
                        onClick={() => request_Book(_id)}
                      >
                        Request
                      </button>
                    ) : (
                      <button
                        type='button'
                        className='btn btn-primary me-2'
                        disabled
                      >
                        Out of Stock
                      </button>
                    )}

                    <Link to={`/books/${_id}`}>
                      <button type='button' className='btn btn-secondary me-2'>
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <p className='p text-center'>Loading ...</p>
      )}
    </div>
  )
}

export default SimilarBooks
