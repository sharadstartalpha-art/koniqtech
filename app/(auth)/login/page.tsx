<button onClick={() => signIn("google")}>Google</button>
<button onClick={() => signIn("github")}>GitHub</button>
<button onClick={() => signIn("facebook")}>Facebook</button>
<button onClick={() => signIn("twitter")}>Twitter</button>

if (!credits) {
  await prisma.userCredits.create({
    data: {
      userId: user.id,
      balance: 20,
    },
  })
}