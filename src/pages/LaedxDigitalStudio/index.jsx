import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";

export default function LaedxDigitalStudioUI() {


    return (
        <section className="fixed top-0 left-0 w-screen h-screen max-h-md flex flex-col p-4 justify-between overflow-hidden pointer-events-none">
            <Header />
            <Footer />
        </section>
    );
}
