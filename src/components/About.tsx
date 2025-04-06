

const About = () => {

    return(
        <div className="max-w-4xl p-10 rounded-lg shadow-md bg-orange-50">
        <h2 className="text-4xl font-bold text-orange-400 text-center mb-6" style={{ fontFamily: '"Rock 3D", cursive' }}>
        About Us
        </h2>
        <p className="text-lg text-gray-700 text-center leading-relaxed">
        At <span className="font-semibold text-orange-500">Babies and Brew</span>, we believe coffee isn't just a drink — it's a moment of peace,
        a spark of joy, and a chance to connect. We created this space with parents in mind, offering a cozy environment
        where families can relax, unwind, and enjoy their favorite brews while the little ones play safely nearby.
        </p>
        <p className="text-lg text-gray-700 text-center mt-4 leading-relaxed">
        Whether you're grabbing a latte on the go, meeting up with friends for a caffeine-fueled catch-up,
        or looking for a friendly spot to nurse your baby and recharge, we're here for you. From our kid-friendly play zone
        to our handcrafted drinks, <span className="font-semibold text-orange-500">Babies and Brew</span> is more than a coffee shop — it's your second home.
        </p>
    </div>
    );
};

export default About;