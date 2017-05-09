# Building Plan

The application for showing interactive building's plans.
Json server was used for initial request. The information about buildings can be found in db/db.json.
Local storage is used for saving of new information (for now). This behaviour can be easily changed.

## Preparing the environment

Make all of the following prerequisites are installed on the development machine:

- Node.js and npm package manager

## Cloning the repository
  
```bash
bitpool-os$: git clone https://github.com/DefeNder93/building-plan.git
bitpool-os$: git checkout master
```

## Running the application

```bash
root-dir$: npm instll -g json-server
root-dir$: npm update
root-dir$: node server.js
root-dir$: json-server --watch db/db.json
```

And open http://localhost:9000

## Interface

Press "Edit rooms" to enable edit mode. Room's borders can be changed and new rooms can be added in this mode. In "View"
mode room can be deleted and information about room can be changed. To add new room press "Add New Room" and add points to the map,
then press "Create Room".

## MIT License

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

