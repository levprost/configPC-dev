<?php

 namespace App\Enums;
 
 use App\Traits\EnumTrait;

enum RoleEnum: string
{
    use EnumTrait;
    case ROLE_USER = 'ROLE_USER';
    case ROLE_ADMIN = 'ROLE_ADMIN';
    case ROLE_EDITOR = 'ROLE_EDITOR';
    case ROLE_MODERATOR = 'ROLE_MODERATOR';
}