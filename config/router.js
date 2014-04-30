/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/


var router = new geddy.RegExpRouter();

router.get('/').to('Main.index');

// Basic routes
// router.match('/moving/pictures/:id', 'GET').to('Moving.pictures');
//
// router.match('/farewells/:farewelltype/kings/:kingid', 'GET').to('Farewells.kings');
//
// Can also match specific HTTP methods only
// router.get('/xandadu').to('Xanadu.specialHandler');
// router.del('/xandadu/:id').to('Xanadu.killItWithFire');
//
// Resource-based routes
// router.resource('hemispheres');
//
// Nested Resource-based routes
// router.resource('hemispheres', function(){
//   this.resource('countries');
//   this.get('/print(.:format)').to('Hemispheres.print');
// });


router.get('/login').to('Main.login');
router.get('/logout').to('Main.logout');
router.post('/auth/local').to('Auth.local');
router.get('/auth/twitter').to('Auth.twitter');
router.get('/auth/twitter/callback').to('Auth.twitterCallback');
router.get('/auth/facebook').to('Auth.facebook');
router.get('/auth/facebook/callback').to('Auth.facebookCallback');

router.resource('users');
router.resource('posts');

router.post('/posts/:id/like(.:format)').to('Likes.create');
router.post('/posts/:id/unlike(.:format)').to('Likes.remove');

router.post('/posts/:id/comment(.:format)').to('Comments.create');
router.put('/comments/:id(.:format)').to('Comments.update');
router.del('/comments/:id(.:format)').to('Comments.remove');

router.post('/files/upload').to('Files.create');
router.put('/files/:id/update(.:format)').to('Files.update');
router.del('/files/:id(.:format)').to('Files.remove');

router.get('/notifications(.:format)').to('Notifications.index');
router.put('/notifications/:id/read(.:format)').to('Notifications.read');

exports.router = router;
