<?php

namespace App\Auth;

use App\Models\User;

class Auth
{
    public function user()
    {
        if (!isset($_SESSION['user'])) {
            return false;
        }

        return User::find($_SESSION['user']);
    }

    public function check()
    {
        return isset($_SESSION['user']);
    }

    public function admin()
    {
        $result = false;
        if(isset($_SESSION['role'])) {
            $result = (intval($_SESSION['role']) === 0);
        }
        return $result;
    }

    public function attempt($email, $password)
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return false;
        }

        if (password_verify($password, $user->password)) {
            $_SESSION['user'] = $user->id;
            $_SESSION['role'] = $user->role;
            return true;
        }

        return false;
    }

    public function logout()
    {
        unset($_SESSION['user']);
    }
}