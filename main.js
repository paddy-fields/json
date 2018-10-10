/*

JSON Format

Post array
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  }

Comment array
  {
    "postId": 1,
    "id": 1,
    "name": "id labore ex et quam laborum",
    "email": "Eliseo@gardner.biz",
    "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium"
  }

*/

// Store the page elements
const navbar = document.querySelector('nav');
const heading = document.querySelector('#heading');
const listing = document.querySelector('#listing');

// Create 'show all users' button element
const allUsersButton = document.createElement('button');
allUsersButton.innerHTML = 'Show all users';
allUsersButton.addEventListener('click', ()=> { getUserIds() });


function json(response) {
  return response.json()
}

function getUserIds(){

  clearHTML(listing);
  clearHTML(navbar);

  // fetch all posts
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then(json)
    .then(function(allPosts) {

      heading.innerHTML = `<h1>Please select a User ID to view this user's posts.</h1>`;

      let currentUser = '';
                           
      // Loop all of the posts and add a div for each of the userId's
      for (let i = 0; i < allPosts.length; i++) {

        if(currentUser != allPosts[i].userId){

          let post = document.createElement('div');
          post.innerHTML = `<p>User ID: ${allPosts[i].userId}</p>`;
          post.className = 'post__block';
          
          // set a callback for when a user is clicked to retrieve the users posts by their userId
          post.addEventListener('click', ()=>{      

            getUserPosts(allPosts[i].userId);
            
          })
    
          listing.appendChild(post);
        }
        currentUser = allPosts[i].userId;
      }




      // Display all posts by this userId
      function getUserPosts(userId){

        window.scrollTo(0,0);

        heading.innerHTML = `<h1>User ${userId} Posts.</h1>
                             <p>Here are all of the posts for User ${userId}.</p>
                             <p>Select a post you would like to view</p>`;

        clearHTML(navbar);                    
        clearHTML(listing);

        // Update the navbar
        navbar.appendChild(allUsersButton);

        for (let i = 0; i < allPosts.length; i++) {
          
          // Only return the posts from the userId that has been clicked
          if(userId === allPosts[i].userId){
            
            let post = document.createElement('div');
            post.innerHTML = `<h3><b>ID:</b> ${allPosts[i].id}</h3>
                              <p class='title'><b>Title:</b> ${allPosts[i].title}`;
            post.className = 'post__block';
            
            // Add an event listener to retrieve this single post when clicked
            post.addEventListener('click', ()=>{      

              getSinglePost(allPosts[i].id,getComments);
             
            })
          
            listing.appendChild(post);

          }
        }
      }



      // Fetch a single post by this id
      function getSinglePost(postId,callback){

        // Fetch the post by its ID
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/`)
          .then(json)
          .then(function(singlePostData) {

            heading.innerHTML = `<h1>Post ${singlePostData.id} - by User ${singlePostData.userId}.</h1>
                                 <p><b>Title:</b> ${singlePostData.title}</p>
                                 <p><b>Content:</b> ${singlePostData.body}</p>
                                 <hr>`;

            clearHTML(navbar);
            clearHTML(listing);

            // Create a back button
            const singleUserButton = document.createElement('button');
            singleUserButton.innerHTML = `Show all User ${singlePostData.userId} posts`;
            singleUserButton.addEventListener('click', ()=> { getUserPosts(singlePostData.userId) });

            navbar.appendChild(singleUserButton);
            
            // Fetch the comments for this post
            callback(postId);

          })
          .catch(function(err) {
            console.log('There was an error', err);
          });
      }
      


      function getComments(postId){
        // Fetch the comments for this post
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
          .then(json)
          .then(function(commentsData) {

            listing.innerHTML = '<h3>Comments</h3>';

            // Loop through all comments for this post
            for (var i = 0; i < commentsData.length; i++) {

              // Create a node for each comment
              let comment = document.createElement('div');
              comment.innerHTML = `<p>ID: ${commentsData[i].id} </p>
                                   <p>Name: ${commentsData[i].name} </p>
                                   <p>Email: ${commentsData[i].email} </p>
                                   <p>Comment: ${commentsData[i].body}</p>`;
              comment.className = 'post__block--comment';

              listing.appendChild(comment);
              
            }

          })
          .catch(function(err) {
            console.log('There was an error', err);
          });
      }



  })
  .catch(function(err) {
    console.log('There was an error', err);
  });

};

function clearHTML(element)
{
    element.innerHTML = '';
}

getUserIds();