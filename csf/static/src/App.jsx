import { useState, useEffect } from 'react'


function App() {
  const [ratings, setRatings] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    comment: '',
    rating: 0,
    image: ''
  })

  useEffect(() => {
    fetch('http://localhost:3000/api/reviews')
      .then(response => response.json())
      .then(data => {
        setRatings(data)
      })
  }, [])

  const getRandomImage = () => {
    fetch('https://dog.ceo/api/breeds/image/random')
      .then(response => response.json())
      .then(data => {
        setFormData({
          name: '',
          comment: '',
          rating: 0,
          image: data.message
        })
      })
  }

  useEffect(() => {
    // fetch('https://dog.ceo/api/breeds/image/random')
    //   .then(response => response.json())
    //   .then(data => {
    //     setFormData({
    //       ...formData,
    //       image: data.message
    //     })
    //   })
    getRandomImage()
  }, [])



  const handleChange = (e) => {
    if (e.target.type === 'number') {
      setFormData({
        ...formData,
        [e.target.name]: parseInt(e.target.value)
      })
      return
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)

    fetch('http://localhost:3000/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        setRatings([
          ...ratings,
          data
        ])
        getRandomImage()
      })
  }


  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Give the dog name and review</h1>
        <div style={{ textAlign: "center" }}>
          <img style={{ height: "150px" }} src={formData.image} alt="" />
        </div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" required
          onChange={handleChange} value={formData.name}
        />

        <label htmlFor="comment">Comment</label>
        <input type="text" id="comment" name="comment" required
          onChange={handleChange} value={formData.comment}
        />

        <label htmlFor="rating">Rating</label>
        <input type="number" id="rating" name="rating" required
          onChange={handleChange} value={formData.rating}
        />


        <button type="submit">Submit</button>
        {/* Next button will refresh the  page */}
        <button type="button" onClick={() => window.location.reload(false)}>Next</button>

      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Comment</th>
            <th>Rating</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((rating, index) => (
            <tr key={index}>
              <td>{rating.name}</td>
              <td>{rating.comment}</td>
              <td>{rating.rating}</td>
              <td>
                <img style={{ height: "50px" }} src={rating.image} alt="" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default App
