import { BrowserRouter, Routes } from 'react-router'
import { Route } from 'react-router'
import MainScreen from './screens/MainScreen'
import CreatePostScreen from './screens/CreatePostScreen'
import PostScreen from './screens/PostScreen'
import SignInScreen from './screens/SignInScreen'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="posts">
          <Route path="new" element={<CreatePostScreen />} />
          <Route path=":postId" element={<PostScreen />} />
        </Route>
        <Route path="auth">
          <Route path="signIn" element={<SignInScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App