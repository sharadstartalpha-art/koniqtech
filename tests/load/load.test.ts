import autocannon from "autocannon"

autocannon({

url:

"http://localhost:3000",

connections:20,

duration:20

},
(
err,
res
)=>{

if(err){

console.log(err)

return

}

console.log(

res

)

})