// components
import LevelOne from '~/components/LevelOne';
import LevelTwo from '~/components/LevelTwo';
import LevelThree from '~/components/LevelThree';
import LevelFour from '~/components/LevelFour';
import LevelFive from '~/components/LevelFive';

function IndexRoute() {
    return (
        <div>
            <LevelOne>
                <LevelTwo>
                    <LevelThree>
                        <LevelFour>
                            <LevelFive />
                        </LevelFour>
                    </LevelThree>
                </LevelTwo>
            </LevelOne>
        </div>
    )
}

export default IndexRoute;
