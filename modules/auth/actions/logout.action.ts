"use server"

import {
clearSession
}
from "../cookies/session"

export async function logoutAction(){

await clearSession()

}