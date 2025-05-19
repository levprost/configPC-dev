import React from "react"; 
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Home from "./pages/HomePage";

import Brand from "./pages/Admin/brands/Brands";
import AddBrand from "./pages/Admin/brands/AddBrand";
import EditBrand from "./pages/Admin/brands/EditBrand";

import Category from "./pages/Admin/categories/Categories";
import AddCategory from "./pages/Admin/categories/AddCategory";
import EditCategory from "./pages/Admin/categories/EditCategory";

import Components from "./pages/Admin/components/Components";
import AddComponent from "./pages/Admin/components/AddComponent";
import EditComponent from "./pages/Admin/components/EditComponent";

import Contact from "./pages/Admin/contacts/Contacts";
import ContactShow from "./pages/Admin/contacts/ContactShow";
import AddContact from "./pages/Admin/contacts/AddContact";

import Register from "./pages/UI/User/Register";
import Login from "./pages/UI/User/Login";

import Posts from "./pages/Admin/posts/Posts";
import AddPost from "./pages/Admin/posts/AddPost";
import EditPost from "./pages/Admin/posts/EditPosts";
import ShowPost from "./pages/UI/Post/ShowPost"
import PostsList from "./pages/UI/Post/Posts"

import ShowConfiguration from "./pages/UI/Configuration/ShowConfiguration"
import AddConfiguration from "./pages/UI/Configuration/AddConfiguration"
import CalculateConfiguration from "./pages/UI/Configuration/CalculateConfiguration";
import AllConfigurations from "./pages/UI/Configuration/AllConfigurations";

import Confident from "./pages/UI/Confident";

import AdminDashboard from "./pages/Admin/AdminDashboard";

const App = () => { 
  const token = localStorage.getItem("access_token");
  return ( 
    <BrowserRouter> 
        <Routes> 
        <Route path="/" element={<Home />} /> 
        <Route path="*" element={<Home />} /> 

        {/* ========================Admin Panel============================ */}

        <Route path="/admin/brands" element={<Brand />} />
        <Route path="/admin/brands/add" element={<AddBrand />} />
        <Route path="/admin/brands/edit/:brand" element={<EditBrand />} />

        <Route path="/admin/categories" element={<Category />} />
        <Route path="/admin/categories/add" element={<AddCategory />} />
        <Route path="/admin/categories/edit/:category" element={<EditCategory />} />

        <Route path="/admin/components" element={<Components />} />
        <Route path="/admin/components/add" element={<AddComponent />} />
        <Route path="/admin/components/edit/:component" element={<EditComponent />}/>

        <Route path="/admin/contacts" element={<Contact />} />
        <Route path="/admin/contacts/:contact" element={<ContactShow />} />
        <Route path="/admin/contacts/add" element={<AddContact />} />

        <Route path="/admin/posts" element={<Posts />} />
        <Route path="/admin/posts/add" element={<AddPost />} />
        <Route path="/admin/posts/edit/:post" element={<EditPost />} />

        <Route path= "/admin/dashboard" element={<AdminDashboard/>}></Route>

        {/* ========================User Interface============================ */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ShowPost/:post" element={<ShowPost />} />
        <Route path="/ShowConfiguration/:configuration" element={<ShowConfiguration />} />
        <Route path="/addconfiguration" element={<AddConfiguration />} />
        <Route path="/configurations" element={< AllConfigurations/>} />
        <Route path="/calculconfiguration" element={<CalculateConfiguration />} />
        <Route path="/posts" element={<PostsList />}/>
        <Route path="/confident" element={<Confident />} />
        </Routes>
    </BrowserRouter> 
  ); 
};

export default App;
