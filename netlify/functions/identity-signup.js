// netlify/functions/identity-signup.js
exports.handler = async (event) => {
  try{
    const payload = JSON.parse(event.body || "{}");
    const user = payload.user || {};
    const meta = user.user_metadata || {};
    const dob = meta.dob;

    if(!dob){
      return { statusCode: 403, body: JSON.stringify({ error: "Date of birth is required to create an account." }) };
    }
    const parts = dob.split("-").map(x=>parseInt(x,10));
    if(parts.length!==3 || parts.some(isNaN)){
      return { statusCode: 403, body: JSON.stringify({ error: "Invalid date of birth." }) };
    }
    const [Y,M,D] = parts;
    const today = new Date();
    const birth = new Date(Date.UTC(Y, (M-1), D));
    let age = today.getUTCFullYear() - birth.getUTCFullYear();
    const mdiff = today.getUTCMonth() - birth.getUTCMonth();
    if (mdiff < 0 || (mdiff === 0 && today.getUTCDate() < birth.getUTCDate())) age--;

    if(age < 13){
      return { statusCode: 403, body: JSON.stringify({ error: "You must be at least 13 years old to create an account." }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        app_metadata: { role: "member" }
      })
    };
  }catch(e){
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};