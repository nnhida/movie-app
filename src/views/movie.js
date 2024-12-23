const url = new URL(location.href);
const movieId = url.searchParams.get('id');
const movieTitle = url.searchParams.get('title');

const api_link = process.env['APILINK'];
const main = document.getElementById('section');
const title = document.getElementById('title');

title.innerText = movieTitle;

const div_new = document.createElement('div');
div_new.innerHTML = `
<div class="row">
  <div class="column">
    <div class="card">
        New Review
        <p><strong>Review: </strong>
          <input type="text" id="new_review" value="">
        </p>
        <p><strong>User: </strong>
          <input type="text" id="new_user" value="">
        </p>
        <p><a href="#" onclick="saveReview('new_review', 'new_user')">💾</a>
        </p>
    </div>
  </div>
</div>       
`;

main.appendChild(div_new);

returnReviews(api_link);

function returnReviews(url) {
  fetch(url + 'movie/' + movieId)
    .then((res) => res.json())
    .then(function (data) {
      console.log(data);
      data.forEach((element) => {
        const div_card = document.createElement('div');
        div_card.innerHTML = `
            <div class="row">
              <div class="column"
                <div class="card" id="${element._id}"
                  <p><strong>Review: </strong>${element.review}</p>
                  <p><strong>User: </strong>${element.user}</p>
                  <p><a href="#" onclick="editReview('${element._id}', '${element.review}', '${element.user}')">✏</a> 
                  <a href="#" onclick="deleteReview('${element._id}')">🗑</a></p>
                </div>
              </div>
            </div>`;

        main.appendChild(div_card);
      });
    });
}

function editReview(id, review, user) {
  console.log(review);
  const element = document.getElementById(id);
  console.log(element);
  const reviewInputId = 'review' + id;
  const userInputId = 'user' + id;

  element.innerHTML = `              
              <p><strong>Review:</strong>
                <input type="text" id="${reviewInputId}" value="${review}">
                </p>
                <p><strong>User:</strong>
                  <input type="text" id="${userInputId}" value="${user}">
                </p>
                <p><a href="#" onclick="saveReview('${reviewInputId}', '${userInputId}', '${id}')">💾</a></p>
  `;
}

function saveReview(reviewInputId, userInputId, id = '') {
  const review = document.getElementById(reviewInputId).value;
  const user = document.getElementById(userInputId).value;

  console.log('Review:', review, 'User:', user, 'ID:', id);

  if (id) {
    fetch(api_link + id, {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: user, review: review }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        location.reload();
      });
  } else {
    fetch(api_link + 'new', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: user, review: review, movieId: movieId }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        location.reload();
      });
  }
}

function deleteReview(id) {
  fetch(api_link + id, {
    method: 'DELETE',
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      location.reload();
    });
}
