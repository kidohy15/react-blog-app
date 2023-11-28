import { Route, Routes, Navigate } from "react-router-dom";
import Home from "pages/home";
import PostList from "pages/posts";
import PostDetail from "pages/posts/detail";
import PostNew from "pages/posts/new";
import PostEdit from "pages/posts/edit";
import ProfilePage from "pages/profile";
import LoginePage from "pages/login";
import SignupPage from "pages/signup";
import { useState } from "react";

interface RouteProps {
  isAuthenticated: boolean;
}

export default function Router({ isAuthenticated }: RouteProps) {

  return (
    <>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path='/' element={<Home />} />
            <Route path='/posts' element={<PostList />} />
            <Route path='/posts/:id' element={<PostDetail/>} />
            <Route path='/posts/new' element={<PostNew/>} />
            <Route path='/posts/edit/:id' element={<PostEdit/>} />
            <Route path='/profile' element={<ProfilePage/>} />
            <Route path='/login' element={<LoginePage/>} />
            <Route path='/signup' element={<SignupPage/>} />
            <Route path='*' element={<Navigate replace to="/"/>} />
          </>
          ) : (
            <>
            <Route path='/login' element={<LoginePage/>} />
            <Route path='/signup' element={<SignupPage/>} />  
            <Route path='*' element={<LoginePage/>} />
          </>
          )}
      </Routes>
    </>
  );
}
